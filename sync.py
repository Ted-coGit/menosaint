#!/usr/bin/env python3
"""Legion AI Publish Sync Pipeline (Astro)

Usage:
    python3 sync.py [--dry-run] [--vault VAULT_DIR] [--output OUTPUT_DIR]

Defaults:
    vault:  /Users/ted/Obsidian/Legion
    output: /Users/ted/Github/menosaint/src/content
"""

import argparse
import hashlib
import json
import os
import re
import shutil
import sys
from pathlib import Path

import yaml

VAULT_DEFAULT = "/Users/ted/Obsidian/Legion"
OUTPUT_DEFAULT = "/Users/ted/Github/menosaint/src/content"
MANIFEST_FILENAME = ".sync-manifest.json"

EXCLUDED_PREFIXES = ("2. daily/", "0. inbox/")


# ---------------------------------------------------------------------------
# Frontmatter
# ---------------------------------------------------------------------------

def parse_frontmatter(path: Path) -> tuple[dict, str]:
    """Return (frontmatter_dict, body_text). On failure return ({}, full_text)."""
    try:
        text = path.read_text(encoding="utf-8")
    except Exception:
        return {}, ""

    if not text.startswith("---"):
        return {}, text

    end = text.find("\n---", 3)
    if end == -1:
        return {}, text

    try:
        fm = yaml.safe_load(text[3:end]) or {}
    except yaml.YAMLError:
        return {}, text

    body = text[end + 4:]
    if body.startswith("\n"):
        body = body[1:]

    return fm, body


def assemble_note(fm: dict, body: str) -> str:
    dumped = yaml.dump(fm, allow_unicode=True, default_flow_style=False, sort_keys=False)
    return f"---\n{dumped}---\n\n{body}"


# ---------------------------------------------------------------------------
# Path helpers
# ---------------------------------------------------------------------------

def slugify(name: str) -> str:
    name = name.lower()
    name = re.sub(r"[^\w\s-]", "", name)
    name = re.sub(r"[\s_]+", "-", name).strip("-")
    return name


def map_to_output(note_path: Path, vault_dir: Path) -> str:
    rel = note_path.relative_to(vault_dir).as_posix()
    stem = note_path.stem

    if rel.startswith("1. Memory/"):
        return f"notes/{slugify(stem)}.md"
    elif rel.startswith("Lab/Projects/"):
        parts = rel.split("/")
        if len(parts) >= 3:
            project = slugify(parts[2])
            return f"lab/{project}/{slugify(stem)}.md"
        return f"notes/{slugify(stem)}.md"
    else:
        return f"notes/{slugify(stem)}.md"


def is_excluded(rel_path: str) -> bool:
    return any(rel_path.startswith(p) for p in EXCLUDED_PREFIXES)


# ---------------------------------------------------------------------------
# Pass 1: build publish index
# ---------------------------------------------------------------------------

def build_publish_index(vault_dir: Path) -> dict:
    index = {}
    errors = []

    for md_file in vault_dir.rglob("*.md"):
        rel = md_file.relative_to(vault_dir).as_posix()
        if is_excluded(rel):
            continue

        try:
            fm, _ = parse_frontmatter(md_file)
        except Exception as e:
            errors.append(f"SKIP (read error) {rel}: {e}")
            continue

        if fm.get("publish") is not True:
            continue

        title = md_file.stem
        output_path = map_to_output(md_file, vault_dir)

        index[title] = {
            "path": md_file,
            "output_path": output_path,
            "slug": "/" + output_path.replace(".md", ""),
        }

    return index, errors


# ---------------------------------------------------------------------------
# Pass 2: transform notes
# ---------------------------------------------------------------------------

def find_attachment(name: str, vault_dir: Path) -> Path | None:
    for f in vault_dir.rglob(name):
        return f
    return None


def transform_links(body: str, publish_index: dict, source_path: Path, vault_dir: Path) -> tuple[str, dict]:
    attachment_refs = {}

    def replace_wikilink(match):
        raw_target = match.group(1).strip()
        display = match.group(2).strip() if match.group(2) else raw_target

        # Strip header anchors for lookup
        target = raw_target.split("#")[0].strip()

        if target in publish_index:
            slug = publish_index[target]["slug"]
            return f"[{display}]({slug})"

        resolved = find_attachment(target, vault_dir)
        if resolved and resolved.suffix.lower() not in (".md",):
            out_path = f"attachments/{resolved.name}"
            attachment_refs[out_path] = resolved
            return f"[{display}]({out_path})"

        return display

    pattern = r"\[\[([^\]|]+)(?:\|([^\]]+))?\]\]"
    body = re.sub(pattern, replace_wikilink, body)
    return body, attachment_refs


def extract_title(body: str, fallback: str) -> tuple[str, str]:
    """본문 첫 h1을 제목으로 승격하고 본문에서 제거한다.

    Legion 노트는 frontmatter에 title이 없고 본문 `# 제목`에 있다.
    Astro 스키마는 title을 요구하므로 여기서 끌어올린다.
    h1이 없으면 파일명을 쓴다.
    """
    lines = body.split("\n")
    for i, line in enumerate(lines):
        stripped = line.strip()
        if not stripped:
            continue
        if stripped.startswith("# "):
            title = stripped[2:].strip()
            del lines[i]
            return title, "\n".join(lines).lstrip("\n")
        # 첫 비어있지 않은 줄이 h1이 아니면 본문이 바로 시작한 것
        break
    return fallback, body


def first_paragraph(body: str, limit: int = 160) -> str:
    """설명이 없을 때 쓸 본문 첫 문단. 목록 카드에 노출된다.

    코드 펜스 안쪽은 건너뛴다. mermaid 블록을 설명으로 잘못 집는 일이 있었다.
    """
    paragraph: list[str] = []
    in_fence = False

    for raw in body.split("\n"):
        line = raw.strip()

        if line.startswith("```") or line.startswith("~~~"):
            in_fence = not in_fence
            continue
        if in_fence:
            continue

        # 문단이 모이는 중에 빈 줄을 만나면 거기서 끊는다
        if not line:
            if paragraph:
                break
            continue

        # 산문이 아닌 줄은 건너뛴다
        if line.startswith(("#", ">", "-", "*", "+", "|", "!", "<")):
            if paragraph:
                break
            continue
        if re.match(r"^\d+[.)]\s", line):
            if paragraph:
                break
            continue

        paragraph.append(line)

    text = " ".join(" ".join(paragraph).split())
    text = re.sub(r"[*_`\[\]]", "", text)
    if len(text) > limit:
        text = text[:limit].rstrip() + "…"
    return text


def to_astro_frontmatter(fm: dict, title: str, body: str, rel_source: str) -> dict:
    """Legion frontmatter를 Astro 스키마로 옮긴다.

    Legion   type / status / created / updated / tags
    Astro    title / description / tags / pubDate / updatedDate / draft / source
    """
    created = fm.get("created")
    updated = fm.get("updated")

    out = {
        "title": title,
        "description": fm.get("description") or first_paragraph(body),
        "tags": fm.get("tags") or [],
        "pubDate": str(created) if created else "",
        "source": rel_source,
    }

    if updated and str(updated) != str(created):
        out["updatedDate"] = str(updated)

    # vault에서 archived 처리된 노트는 초안으로 넘긴다
    if fm.get("status") == "archived":
        out["draft"] = True

    # 빈 값은 넣지 않는다
    return {k: v for k, v in out.items() if v not in ("", None, [])} | {
        "tags": out["tags"]
    }


def transform_note(meta: dict, publish_index: dict, vault_dir: Path) -> tuple[str, dict]:
    note_path: Path = meta["path"]
    fm, body = parse_frontmatter(note_path)

    fm.pop("publish", None)

    body, attachment_refs = transform_links(body, publish_index, note_path, vault_dir)
    title, body = extract_title(body, note_path.stem)

    rel_source = note_path.relative_to(vault_dir).as_posix()
    astro_fm = to_astro_frontmatter(fm, title, body, rel_source)
    content = assemble_note(astro_fm, body)

    return content, attachment_refs


# ---------------------------------------------------------------------------
# Attachments
# ---------------------------------------------------------------------------

def collect_attachments(processed_notes: dict) -> dict:
    all_refs = {}
    for _, (_, refs) in processed_notes.items():
        all_refs.update(refs)
    return all_refs


# ---------------------------------------------------------------------------
# Hash manifest
# ---------------------------------------------------------------------------

def sha256_str(text: str) -> str:
    return "sha256:" + hashlib.sha256(text.encode("utf-8")).hexdigest()


def sha256_bytes(data: bytes) -> str:
    return "sha256:" + hashlib.sha256(data).hexdigest()


def build_manifest(processed_notes: dict, attachments: dict) -> dict:
    manifest = {}

    for out_path, (content, _) in processed_notes.items():
        manifest[out_path] = sha256_str(content)

    for out_path, src_path in attachments.items():
        try:
            manifest[out_path] = sha256_bytes(src_path.read_bytes())
        except Exception:
            pass

    return manifest


# ---------------------------------------------------------------------------
# Reconciliation
# ---------------------------------------------------------------------------

def reconcile(
    prev_manifest: dict,
    new_manifest: dict,
    processed_notes: dict,
    attachments: dict,
    output_dir: Path,
    dry_run: bool,
) -> list[tuple[str, str]]:
    ops = []

    for out_path, new_hash in new_manifest.items():
        if prev_manifest.get(out_path) != new_hash:
            ops.append(("write", out_path))

    for out_path in prev_manifest:
        if out_path not in new_manifest:
            ops.append(("delete", out_path))

    prefix = "[dry-run] " if dry_run else ""
    write_count = delete_count = 0
    errors = []

    for op, out_path in ops:
        if op == "write":
            write_count += 1
            print(f"{prefix}write  {out_path}")
            if not dry_run:
                dest = output_dir / out_path
                dest.parent.mkdir(parents=True, exist_ok=True)
                try:
                    if out_path in processed_notes:
                        content, _ = processed_notes[out_path]
                        dest.write_text(content, encoding="utf-8")
                    else:
                        src = attachments[out_path]
                        shutil.copy2(src, dest)
                except Exception as e:
                    errors.append(f"FAIL write {out_path}: {e}")
                    write_count -= 1

        elif op == "delete":
            delete_count += 1
            print(f"{prefix}delete {out_path}")
            if not dry_run:
                target = output_dir / out_path
                try:
                    target.unlink(missing_ok=True)
                except Exception as e:
                    errors.append(f"FAIL delete {out_path}: {e}")

    print(f"{prefix}total: {write_count} write, {delete_count} delete")
    return errors


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="Legion AI Publish Sync Pipeline")
    parser.add_argument("--vault", default=VAULT_DEFAULT, help="Obsidian vault directory")
    parser.add_argument("--output", default=OUTPUT_DEFAULT, help="Astro content collections directory")
    parser.add_argument("--dry-run", action="store_true", help="Preview only, no file writes")
    args = parser.parse_args()

    vault_dir = Path(args.vault).expanduser().resolve()
    output_dir = Path(args.output).expanduser().resolve()
    manifest_path = output_dir / MANIFEST_FILENAME

    if not vault_dir.exists():
        print(f"ERROR: vault not found: {vault_dir}", file=sys.stderr)
        sys.exit(1)

    # Phase 1
    publish_index, scan_errors = build_publish_index(vault_dir)
    print(f"{len(publish_index)} notes to publish")
    for e in scan_errors:
        print(f"WARN {e}")

    # Phase 2
    processed_notes = {}
    transform_errors = []

    for title, meta in publish_index.items():
        try:
            content, refs = transform_note(meta, publish_index, vault_dir)
            processed_notes[meta["output_path"]] = (content, refs)
        except Exception as e:
            transform_errors.append(f"SKIP (transform error) {meta['path']}: {e}")

    for e in transform_errors:
        print(f"WARN {e}")

    attachments = collect_attachments(processed_notes)
    print(f"{len(attachments)} attachments referenced")

    # Phase 3
    new_manifest = build_manifest(processed_notes, attachments)

    prev_manifest = {}
    if manifest_path.exists():
        try:
            prev_manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        except Exception:
            pass

    # Phase 4
    reconcile_errors = reconcile(
        prev_manifest, new_manifest, processed_notes, attachments, output_dir, args.dry_run
    )

    for e in reconcile_errors:
        print(f"WARN {e}")

    if not args.dry_run:
        manifest_path.write_text(json.dumps(new_manifest, indent=2, ensure_ascii=False), encoding="utf-8")
        print("sync complete")

    total_warnings = len(scan_errors) + len(transform_errors) + len(reconcile_errors)
    if total_warnings:
        print(f"\n{total_warnings} warning(s) — review above")


if __name__ == "__main__":
    main()

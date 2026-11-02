import json

found = []
transcript_path = r"C:\Users\Harshad\.gemini\antigravity\brain\bb4b4207-3ad0-40ee-99c4-97a6222f6dfd\.system_generated\logs\transcript.jsonl"
with open(transcript_path, "r", encoding="utf-8") as f:
    for line in f:
        data = json.loads(line)
        calls = data.get("tool_calls", [])
        for c in calls:
            if c.get("name") in ["write_file", "edit_file"]:
                path = c.get("args", {}).get("Path", "")
                if "apaar_verify_workflow.drawio" in path:
                    content = c.get("args", {}).get("Content", "")
                    found.append((data.get("step_index"), content))

print(f"Total versions found: {len(found)}")
for s, content in found:
    print(f"Step {s}: length {len(content)}, preview: {content[:80]}")

if found:
    # Save the 3-column one if exists
    for s, content in found:
        if "INSTITUTION ADMISSION & INGESTION PIPELINE" in content:
            print(f"Found 3-column version at step {s}!")
            with open("three_col_workflow.xml", "w", encoding="utf-8") as out:
                out.write(content)


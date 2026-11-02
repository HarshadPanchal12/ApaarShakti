import json

transcript_path = r"C:\Users\Harshad\.gemini\antigravity\brain\bb4b4207-3ad0-40ee-99c4-97a6222f6dfd\.system_generated\logs\transcript_full.jsonl"
with open(transcript_path, "r", encoding="utf-8") as f:
    for line in f:
        data = json.loads(line)
        calls = data.get("tool_calls", [])
        for c in calls:
            path = c.get("args", {}).get("Path", "")
            if ".drawio" in path:
                content = c.get("args", {}).get("Content", "")
                print(f"Step {data.get('step_index')}: Path: {path}, len: {len(content)}")
                if "INSTITUTION ADMISSION & INGESTION PIPELINE" in content:
                    with open("extracted_3col_workflow.xml", "w", encoding="utf-8") as out:
                        out.write(content)
                    print(f"FOUND 3-col at step {data.get('step_index')}!")


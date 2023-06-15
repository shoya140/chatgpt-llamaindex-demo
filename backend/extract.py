import sys
import os
import json
import glob
import progressbar

INPUT_DIR = "/1-wikipedia/"
OUTPUT_DIR = "/2-document/"

def extract_pages_with_keyword(input_dir, keyword, output_dir):
    gs = glob.glob(input_dir + "**/wiki_*")
    pbar = progressbar.ProgressBar(max_value=len(gs))
    for i, g in enumerate(gs):
        pbar.update(i+1)
        with open(g, "r", encoding="utf-8") as f:
            for line in f:
                try:
                    page_data = json.loads(line.strip())
                    if keyword in page_data["text"]:
                        output_file = os.path.join(output_dir, f"{page_data['id']+'-'+page_data['title']}.txt")
                        with open(output_file, "w", encoding="utf-8") as out_f:
                            out_f.write(page_data["title"] + "\n\n" + page_data["text"])
                except json.JSONDecodeError:
                    continue

if __name__ == "__main__":
    if len(sys.argv) == 2:
        keyword = sys.argv[1]
        input_path = os.path.dirname(__file__) + INPUT_DIR
        output_path = os.path.dirname(__file__) + OUTPUT_DIR + keyword

        if not os.path.exists(output_path):
            os.makedirs(output_path)

        extract_pages_with_keyword(input_path, keyword, output_path)
    else:
        print("Usage: python extract.py [keyword]")

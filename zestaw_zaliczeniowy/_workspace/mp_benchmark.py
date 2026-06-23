
import re, time, os, json, sys
sys.path.insert(0, "/home/yuki/AAP_LAB_TASKS/zestaw_zaliczeniowy/_workspace")
os.environ.setdefault("HF_DATASETS_DISABLE_PROGRESS_BAR", "1")
os.environ.setdefault("TRANSFORMERS_VERBOSITY", "error")
from concurrent.futures import ProcessPoolExecutor
from datasets import load_dataset

POS_WORDS = {"good","great","excellent","wonderful","love","best","amazing","brilliant","perfect"}
NEG_WORDS = {"bad","worst","awful","terrible","hate","boring","waste","poor","horrible"}

def sentiment_score(text: str) -> int:
    words = re.findall(r'\w+', text.lower())
    return sum(1 for w in words if w in POS_WORDS) - sum(1 for w in words if w in NEG_WORDS)

if __name__ == "__main__":
    ds = load_dataset("stanfordnlp/imdb", split="train").shuffle(seed=42).select(range(5000))
    texts = [r["text"] for r in ds]
    t0 = time.time()
    with ProcessPoolExecutor(max_workers=os.cpu_count()) as ex:
        list(ex.map(sentiment_score, texts, chunksize=100))
    print(json.dumps({"mp": round(time.time()-t0, 3), "cpus": os.cpu_count()}))

import os
import sys
import logging
from llama_index import VectorStoreIndex, SimpleDirectoryReader, ServiceContext, LLMPredictor, StorageContext, load_index_from_storage
from langchain.chat_models import ChatOpenAI

INPUT_DIR = "/2-document/"
OUTPUT_DIR = "/3-index/"

logging.basicConfig(stream=sys.stdout, level=logging.INFO)
logging.getLogger().addHandler(logging.StreamHandler(stream=sys.stdout))

def main(index_name):
    llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0, streaming=True)
    llm_predictor = LLMPredictor(llm=llm)
    service_context = ServiceContext.from_defaults(llm_predictor=llm_predictor)

    documents = SimpleDirectoryReader(input_dir=os.path.dirname(__file__) + INPUT_DIR + index_name).load_data()
    index = VectorStoreIndex.from_documents(documents, service_context=service_context)
    index.set_index_id("vector_index")
    index.storage_context.persist(os.path.dirname(__file__)+ OUTPUT_DIR + index_name)


if __name__ == "__main__":
    if len(sys.argv) == 2:
        main(sys.argv[1])
    else:
        print("Usage: python index.py [index name]")

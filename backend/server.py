import os
import uvicorn
import asyncio
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from llama_index import load_index_from_storage, StorageContext, ServiceContext, LLMPredictor, StorageContext
from fastapi.middleware.cors import CORSMiddleware
from langchain.chat_models import ChatOpenAI

llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0, streaming=True)
llm_predictor = LLMPredictor(llm=llm)
service_context = ServiceContext.from_defaults(llm_predictor=llm_predictor)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class QueryModel(BaseModel):
    index: str
    query: str


async def astreamer(generator):
    try:
        for i in generator:
            yield (i)
            await asyncio.sleep(.1)
    except asyncio.CancelledError as e:
        print('cancelled')


@app.post("/generate")
async def query_index(query_model: QueryModel):
    storage_context = StorageContext.from_defaults(persist_dir=os.path.dirname(__file__)+'/3-index/' + query_model.index)
    index = load_index_from_storage(storage_context, service_context=service_context)

    query_engine = index.as_query_engine(streaming=True, similarity_top_k=1)
    response = query_engine.query(query_model.query)
    return StreamingResponse(astreamer(response.response_gen), media_type="text/event-stream")


def start():
    uvicorn.run("server:app", host="0.0.0.0", port=8000)


if __name__ == "__main__":
    start()

# chatgpt-llamaindex-demo

![Image from Gyazo](https://i.gyazo.com/a69a7cc4671db0847cd770625e3699b8.png)

## Getting Started

1. Add OPENAI_API_KEY to environment variables
    ```
    # .env.local
    OPENAI_API_KEY=...
    ```

2. Install dependencies
    ```bash
    $ pip install -r backend/requirements.txt
    $ yarn install
    ```

3. Start the server.
    ```bash
    $ yarn build && yarn start
    ```

## Build Your Own Index

0. (Optional) Copy wikipedia dump files into `1-wikipedia` and extract documents containing a keyword.
    ```bash
    .
    ├── README.md
    └── backend
        └── 1-wikipedia
            └── AA
                ├── wiki_00
                ├── wiki_01
                └── wiki_02 ...

    $ python backend/extract.py [keyword]
    ```

1. Create embeddings by using an OpenAI API.
    ```bash
    $ python backend/index.py [keyword]
    ```

2. Add a new option for using the index in `src/page.tsx`.
    ```typescript
    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
    <option value="gpt-4">GPT-4</option>
    <option value="llama-keyword">Llama Keyword</option>
    ...
    ```

3. Start the server.
    ```bash
    $ yarn build && yarn start
    ```


## What Is CloudRift Inference ?

CloudRift Inference lets you run large-language-model (LLM) and general AI inference on demand, powered by **high-performance AMD and NVIDIA GPUs** 

* **Pay-as-you-go** – billing per **million tokens**, no reserved capacity needed  
* **Low-latency endpoints** ready for production workloads  

---

## Quick Start (REST API)

> CloudRift endpoints are **OpenAI-compatible** – you can drop them into any OpenAI client by changing the base URL and model name.

1. **Create an API Token**  
   – Sign in → **APIs ** → *Generate Token*  
   – Copy and store the token securely, as they cannot be shown again later.

2. **Call the `/v1/chat/completions` endpoint**

```bash
curl -X POST https://inference.cloudrift.ai/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_RIFT_API_KEY" \
  -d '{ 
    "model": "llama4:maverick",
    "messages": [
      {"role": "user", "content": "What is the meaning of life?"}
    ],
    "stream": true
  }'
```
### Supported Parameters

The API supports the same request-body fields as OpenAI’s **chat/completions** specification (e.g. `temperature`, `top_p`, `max_tokens`, `stream`).  
For the full list see the [OpenAI API reference](https://platform.openai.com/docs/api-reference/chat).

---

### Models & Pricing

Token pricing and context limits are listed on the live **[Models & Pricing page](https://www.cloudrift.ai/inference)**.  
Prices may change as we add new checkpoints or hardware generations; check that page for the latest rates.

---

## FAQ

<details>
<summary><strong>Do you support server-side streaming?</strong></summary>

Yes. Send `"stream": true`; the response is `text/event-stream`.
</details>

<details>
<summary><strong>What latency should I expect?</strong></summary>

Typical first-token latency is ≈ 120 ms on current 8 B models; larger checkpoints take longer.
</details>



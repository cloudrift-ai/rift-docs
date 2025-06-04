

## What Is CloudRift Inference ?

CloudRift Inference lets you run large-language-model (LLM) and general AI inference on demand, using the same GPU fleet that powers our rental platform.

* **Pay-as-you-go** – per-second billing, no reserved capacity needed  
* **Low-latency endpoints** backed by dedicated AMD MI300X hardware  
* **Scale to zero** when idle, auto-scale under load  

---
## Quick Start (REST API)

```bash
# Get a prediction from Llama 4 Maverick – temperature 0.2
curl -X POST https://api.cloudrift.ai/v1/inference \
     -H "Authorization: Bearer <API_TOKEN>" \
     -H "Content-Type: application/json" \
     -d '{
           "model": "llama4:maverick",
           "prompt": "Explain quantum computing to a 12-year-old.",
           "parameters": { "temperature": 0.2 }
         }'

```
---

## Request Fields

| Field        | Type   | Required | Notes                                               |
|--------------|--------|----------|-----------------------------------------------------|
| `model`      | string | ✓        | e.g. `llama4:maverick`, `deepseek-v3`               |
| `prompt`     | string | ✓        | Up to **8 k** tokens                                |
| `parameters` | object | –        | `temperature`, `top_p`, `max_tokens`, …             |
| `stream`     | bool   | –        | If `true`, response is **Server-Sent Events (SSE)** |

---

## Pricing

| Model                | In-Token Price | Out-Token Price | Context Limit |
|----------------------|---------------:|----------------:|--------------:|
| **Llama 4 Maverick** | \$0.10         | \$0.35          | 1.05 M        | 
| **DeepSeek V3**      | \$0.15         | \$0.40          | 163.84 K      | 
| **DeepSeek R1**      | \$0.15         | \$0.40          | 163.84 K      |

*Pay only for generated tokens. Idle endpoints scale to 0 → no base fee.*

---

## FAQ

### Do you support server-side streaming?

Yes. Set `"stream": true` and the API returns `text/event-stream` chunks.

### What latency should I expect?

Typical ≈ 120 ms first-token latency on RTX 4090 for 8-B models; higher for larger checkpoints. Endpoints auto-scale when concurrency spikes.


---


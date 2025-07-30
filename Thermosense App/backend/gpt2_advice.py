from gradio_client import Client

client = Client("TanushriS/thermosense")

def get_advice_from_gpt2(battery_temp: float, ambient_temp: float, device_state: str) -> str:
    """
    Calls the GPT-2 model hosted on Hugging Face to generate advice
    based on temperature and device state.

    Returns a natural language tip or a fallback message.
    """
    try:
        result = client.predict(
            battery_temp=battery_temp,
            ambient_temp=ambient_temp,
            device_state=device_state,
            api_name="/predict"
        )
        return result
    except Exception as e:
        print("Error calling GPT-2 advice generator:", e)
        return "⚠️ GPT-2 service failed. Using fallback."

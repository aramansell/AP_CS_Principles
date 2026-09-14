using UnityEngine;
using UnityEngine.Events;

public class Lever : MonoBehaviour
{
    // Simple visual swapping
    [SerializeField] private Sprite offSprite;
    [SerializeField] private Sprite onSprite;

    // Events to trigger things (like opening a door)
    [SerializeField] private UnityEvent onLeverOn;
    [SerializeField] private UnityEvent onLeverOff;

    private SpriteRenderer spriteRenderer;
    private bool isOn = false;

    private void Start()
    {
        spriteRenderer = GetComponent<SpriteRenderer>();
        // Default to off
        if (spriteRenderer != null && offSprite != null)
        {
            spriteRenderer.sprite = offSprite;
        }
    }

    // Called by PlayerController when 'E' is pressed nearby
    public void Interact()
    {
        isOn = !isOn; // Toggle state

        if (isOn)
        {
            if (spriteRenderer != null && onSprite != null) spriteRenderer.sprite = onSprite;
            onLeverOn.Invoke();
        }
        else
        {
             if (spriteRenderer != null && offSprite != null) spriteRenderer.sprite = offSprite;
             onLeverOff.Invoke();
        }
    }
}
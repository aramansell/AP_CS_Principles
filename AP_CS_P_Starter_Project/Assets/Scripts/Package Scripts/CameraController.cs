using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CameraController : MonoBehaviour
{
    [SerializeField] Vector2 offset;
    [SerializeField] private bool lockY;

    private GameObject player;
    private Vector3 offset3D;

    // Start is called before the first frame update
    void Start()
    {
        player = GameObject.FindWithTag("Player");
        offset3D = new Vector3(offset.x, offset.y, -10f);
    }

    // Update is called once per frame
    void Update()
    {
        Vector3 newPosition = player.transform.position + offset3D;
        if (lockY)
        {
            newPosition.y = transform.position.y;
        }
        transform.position = newPosition;
    }
}

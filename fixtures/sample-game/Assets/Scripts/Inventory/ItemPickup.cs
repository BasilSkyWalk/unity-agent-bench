using UnityEngine;

namespace SampleGame.Inventory
{
    /// <summary>
    /// World pickup that adds its <see cref="Item"/> to an Inventory. The serialized
    /// <c>item</c> field gives prefabs a cross-asset GUID reference (used by verify/refs).
    /// </summary>
    public class ItemPickup : MonoBehaviour
    {
        [SerializeField] private Item item;

        public Item Item => item;

        public void PickUp(Inventory inventory)
        {
            if (inventory != null && item != null)
            {
                inventory.Add(item);
            }
        }
    }
}

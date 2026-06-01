using UnityEngine;

namespace SampleGame.Inventory
{
    /// <summary>A collectable item asset. Referenced by prefabs via GUID.</summary>
    [CreateAssetMenu(menuName = "SampleGame/Item")]
    public class Item : ScriptableObject
    {
        public string displayName = "Item";
        public int value = 1;
    }
}

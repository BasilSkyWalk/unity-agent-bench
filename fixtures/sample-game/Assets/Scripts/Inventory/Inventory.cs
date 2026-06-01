using System.Collections.Generic;
using UnityEngine;

namespace SampleGame.Inventory
{
    /// <summary>Holds a list of items.</summary>
    public class Inventory : MonoBehaviour
    {
        private readonly List<Item> items = new();

        public IReadOnlyList<Item> Items => items;
        public int Count => items.Count;

        public void Add(Item item)
        {
            if (item != null)
            {
                items.Add(item);
            }
        }

        public bool Remove(Item item)
        {
            return items.Remove(item);
        }
    }
}

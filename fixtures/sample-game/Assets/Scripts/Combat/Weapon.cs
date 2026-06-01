using UnityEngine;

namespace SampleGame.Combat
{
    /// <summary>Deals a fixed amount of damage to a target. Call site for ApplyDamage.</summary>
    public class Weapon : MonoBehaviour
    {
        [SerializeField] private int damage = 10;

        public int Damage => damage;

        public void Hit(IDamageable target)
        {
            target.ApplyDamage(damage);
        }
    }
}

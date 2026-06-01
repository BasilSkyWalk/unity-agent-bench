using UnityEngine;

namespace SampleGame.Combat
{
    /// <summary>Tracks hit points and implements <see cref="IDamageable"/>.</summary>
    public class Health : MonoBehaviour, IDamageable
    {
        [SerializeField] private int maxHealth = 100;

        public int Max => maxHealth;
        public int Current { get; private set; }
        public bool IsDead => Current <= 0;

        private void Awake()
        {
            Current = maxHealth;
        }

        public void ApplyDamage(int amount)
        {
            Current = Mathf.Max(0, Current - Mathf.Max(0, amount));
        }

        public void ResetHealth()
        {
            Current = maxHealth;
        }
    }
}

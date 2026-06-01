using UnityEngine;

namespace SampleGame.Combat
{
    /// <summary>Periodic-damage volume. Second call site for ApplyDamage.</summary>
    public class DamageZone : MonoBehaviour
    {
        [SerializeField] private int damagePerTick = 5;

        public void Tick(Health target)
        {
            target.ApplyDamage(damagePerTick);
        }
    }
}

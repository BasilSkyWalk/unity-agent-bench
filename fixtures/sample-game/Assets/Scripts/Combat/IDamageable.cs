namespace SampleGame.Combat
{
    /// <summary>
    /// Anything that can receive damage. <see cref="ApplyDamage"/> is the rename
    /// surface exercised by the ts-callsites-01 task.
    /// </summary>
    public interface IDamageable
    {
        void ApplyDamage(int amount);
    }
}

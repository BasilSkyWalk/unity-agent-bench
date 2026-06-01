using NUnit.Framework;
using UnityEngine;
using SampleGame.Combat;

namespace SampleGame.Tests.EditMode
{
    /// <summary>
    /// Trivial EditMode test proving the test-runner verifier works (PROGRESS A4).
    /// Real per-task hidden tests live with each task, not in the fixture.
    /// </summary>
    public class SmokeTests
    {
        [Test]
        public void Health_resets_to_max()
        {
            var go = new GameObject("test-subject");
            try
            {
                var health = go.AddComponent<Health>();
                health.ApplyDamage(30);
                health.ResetHealth();
                Assert.AreEqual(health.Max, health.Current);
            }
            finally
            {
                Object.DestroyImmediate(go);
            }
        }
    }
}

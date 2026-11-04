Scriptname CG_HollowfangKillTracker extends ActiveMagicEffect

CG_HollowfangController Property CG_HollowfangQuest Auto
Actor Property PlayerRef Auto

Actor target  ; cached - the effect may be gone by the time OnDying runs

Event OnEffectStart(Actor akTarget, Actor akCaster)
    target = akTarget
    Debug.Trace("[Hollowfang] hit " + akTarget + " dead=" + akTarget.IsDead())
EndEvent

Event OnDying(Actor akKiller)
    Debug.Trace("[Hollowfang] dying, killer=" + akKiller)
    If akKiller == PlayerRef
        CG_HollowfangQuest.RegisterKill(target)
    EndIf
EndEvent
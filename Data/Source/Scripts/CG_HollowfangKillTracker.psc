Scriptname CG_HollowfangKillTracker extends ActiveMagicEffect

CG_HollowfangController Property CG_HollowfangQuest Auto
GlobalVariable Property CG_HollowfangKills Auto
Actor Property PlayerRef Auto
Float Property DeepThirstAmount = 5.0 Auto

Actor target  ; cached - the effect may be gone by the time OnDying runs

Event OnEffectStart(Actor akTarget, Actor akCaster)
    target = akTarget
    ; Deep Thirst: done in script because perk hit spells report the target as caster
    If !akTarget.IsDead() && CG_HollowfangKills.GetValueInt() >= 50
        akTarget.DamageActorValue("Stamina", DeepThirstAmount)
        PlayerRef.RestoreActorValue("Stamina", DeepThirstAmount)
    EndIf
EndEvent

Event OnDying(Actor akKiller)
    If akKiller == PlayerRef
        CG_HollowfangQuest.RegisterKill(target)
    EndIf
EndEvent
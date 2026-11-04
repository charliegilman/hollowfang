Scriptname CG_HollowfangWeapon extends ObjectReference

CG_HollowfangController Property CG_HollowfangQuest Auto
Perk Property CG_HollowfangPerk Auto
Spell Property CG_HollowfangPassives Auto   ; stays empty until Stage 4
Actor Property PlayerRef Auto

Event OnEquipped(Actor akActor)
    Debug.Trace("[Hollowfang] OnEquipped actor=" + akActor + " player=" + PlayerRef + " perk=" + CG_HollowfangPerk)
    If akActor != PlayerRef
        Return
    EndIf
    If !PlayerRef.HasPerk(CG_HollowfangPerk)
        PlayerRef.AddPerk(CG_HollowfangPerk)
        Debug.Notification("Hollowfang bonds with you.")
    EndIf
    If CG_HollowfangPassives && !PlayerRef.HasSpell(CG_HollowfangPassives)
        PlayerRef.AddSpell(CG_HollowfangPassives, false)
    EndIf
    CG_HollowfangQuest.RefreshSpeedSoon()
EndEvent

Event OnUnequipped(Actor akActor)
    If akActor == PlayerRef
        CG_HollowfangQuest.RefreshSpeedSoon()
    EndIf
EndEvent
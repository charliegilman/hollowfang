Scriptname CG_HollowfangController extends Quest

GlobalVariable Property CG_HollowfangKills Auto
Actor Property PlayerRef Auto
Weapon Property CG_Hollowfang Auto

Message Property CG_HollowfangMsgSoulFeeding Auto
Message Property CG_HollowfangMsgSilentStep Auto
Message Property CG_HollowfangMsgDeepThirst Auto

Float Property SoulFeedingCharge = 100.0 Auto

Int lastUnlock = 0
Bool daggerGiven = false
Actor lastVictim

Event OnInit()
    Debug.Trace("[Hollowfang] controller initialised")
    Debug.Notification("Hollowfang controller loaded")   ; debug - remove in 1.0.1
    GiveDagger()
EndEvent

Function GiveDagger()
    ; Set the flag first: OnInit can run twice for Start Game Enabled quests
    If daggerGiven
        Return
    EndIf
    daggerGiven = true

    If PlayerRef.GetItemCount(CG_Hollowfang) == 0
        PlayerRef.AddItem(CG_Hollowfang, 1, true)
        Debug.Notification("Something cold settles into your pack. Hollowfang has found you.")
        Debug.Trace("[Hollowfang] dagger given")
    EndIf
EndFunction

Function RegisterKill(Actor akVictim)
    If akVictim == None || akVictim == lastVictim
        Return
    EndIf
    lastVictim = akVictim

    Int kills = CG_HollowfangKills.GetValueInt() + 1
    CG_HollowfangKills.SetValueInt(kills)
    Debug.Trace("[Hollowfang] kills = " + kills)

    If kills >= 10
        RefundCharge()
    EndIf

    CheckUnlocks(kills)

    If kills <= 50 && kills % 10 == 0
        Debug.Notification("Hollowfang quickens your step.")
        RefreshSpeedSoon()
    EndIf
EndFunction

Function CheckUnlocks(Int kills)
    If kills >= 10 && lastUnlock < 10
        lastUnlock = 10
        CG_HollowfangMsgSoulFeeding.Show()
    EndIf
    ; If kills >= 25 && lastUnlock < 25
    ;     lastUnlock = 25
    ;     CG_HollowfangMsgSilentStep.Show()
    ; EndIf
    ; If kills >= 50 && lastUnlock < 50
    ;     lastUnlock = 50
    ;     CG_HollowfangMsgDeepThirst.Show()
    ; EndIf
EndFunction

Function RefundCharge()
    If PlayerRef.GetEquippedWeapon(false) == CG_Hollowfang
        PlayerRef.RestoreActorValue("RightItemCharge", SoulFeedingCharge)
    ElseIf PlayerRef.GetEquippedWeapon(true) == CG_Hollowfang
        PlayerRef.RestoreActorValue("LeftItemCharge", SoulFeedingCharge)
    EndIf
EndFunction

Function RefreshSpeedSoon()
    RegisterForSingleUpdate(1.5)
EndFunction

Event OnUpdate()
    PlayerRef.ModActorValue("CarryWeight", 0.1)
    PlayerRef.ModActorValue("CarryWeight", -0.1)
EndEvent
# Debug: Notification Voice Playback

## Problème
L'audio se génère côté backend mais ne se lit pas automatiquement dans le frontend.

## Checklist de diagnostic

### 1. Vérifier que l'audio se génère bien
```powershell
# Dans un terminal backend
cd backend
python notification_system.py

# Regarder les logs - vous devriez voir:
# 🔊 Generating voice for notification...
# ✓ Voice generated: XXXXX bytes
```

### 2. Tester la génération directement
```powershell
cd backend
python test_voice_notification.py
# Écouter test_voice_notification.mp3 et test_formatted_notification.mp3
```

### 3. Vérifier l'endpoint voice
Ouvrir dans le navigateur ou Postman:
```
http://localhost:5001/api/notifications/<notification-id>/voice
```
Le fichier MP3 devrait se télécharger/jouer.

### 4. Console navigateur (F12)
Chercher dans la console:
- `🎤 Voice ready for notification...` ← L'événement SSE arrive
- `🔊 Attempting to play voice from...` ← La lecture commence
- `✓ Voice loaded: XXX bytes` ← Le fichier est chargé
- `▶ Playing audio...` ← Tentative de lecture
- `✓ Audio playing` ← Succès!

**Erreurs possibles:**
- `DOMException: play() failed` → Autoplay bloqué par le navigateur
- `Failed to fetch` → Problème CORS
- `Voice fetch failed: 404` → L'audio n'est pas encore prêt

### 5. Solutions selon l'erreur

#### A. Autoplay bloqué (le plus courant)
Les navigateurs bloquent l'autoplay sans interaction utilisateur.

**Solution 1**: Cliquer sur le bouton "Play" manuellement dans la notification
**Solution 2**: Interagir avec la page d'abord (clic n'importe où) puis recharger

#### B. CORS bloqué
```
Access to fetch at 'http://localhost:5001/...' from origin 'http://localhost:5173' has been blocked by CORS
```

**Solution**: Vérifier que `CORS(app)` est bien dans notification_system.py (déjà fait)

#### C. Voice pas encore prête
Le frontend essaie de lire avant que le backend finisse de générer.

**Solution**: Attendre l'événement `voice_ready` (déjà implémenté avec le nouveau code)

### 6. Test manuel complet

1. **Démarrer backend notification**:
```powershell
cd backend
python notification_system.py
```

2. **Démarrer frontend**:
```powershell
npm run dev
```

3. **Poster une notification critique**:
```powershell
cd backend
python post_notifications.py
```

4. **Dans le navigateur**:
   - Ouvrir la console (F12)
   - Cliquer sur l'icône de notification (cloche)
   - Chercher la notification "Workflow Failure" (priority: critical)
   - **CLIQUER SUR LE BOUTON "Play"** (ne pas attendre l'autoplay)
   - Vérifier les logs console

### 7. Workaround temporaire

Si l'autoplay ne marche jamais, **désactiver l'autoplay** et forcer le manuel:

Dans `NotificationCenter.tsx`, commenter les lignes d'autoplay:
```typescript
// Auto-play désactivé - utilisez le bouton Play
// if (notification.priority === 'high' || notification.priority === 'critical') {
//   console.log(`🔊 Auto-playing voice for ${notification.priority} notification`);
//   setTimeout(() => playVoice(updated, true), 500);
// }
```

Puis cliquez toujours manuellement sur "Play".

### 8. Permissions navigateur

**Chrome/Edge**: Autoriser le son pour localhost
1. Aller sur `chrome://settings/content/sound`
2. Ajouter `http://localhost:5173` aux sites autorisés

**Firefox**: 
1. Cliquer sur l'icône à gauche de l'URL
2. Permissions → Autoplay → Autoriser l'audio et la vidéo

## Résumé rapide

1. ✓ Backend génère l'audio (vérifier logs)
2. ✓ L'événement SSE arrive (console: "Voice ready")
3. ✗ **L'autoplay est probablement bloqué**
4. → **Solution**: Cliquer sur le bouton "Play" dans la notification

Le bouton "Play" fonctionne **toujours** car c'est une interaction utilisateur.
L'autoplay ne marche que si l'utilisateur a déjà interagi avec la page.

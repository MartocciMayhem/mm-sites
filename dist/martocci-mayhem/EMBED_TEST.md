# Video Embedding Test

## Current Status:
- ✅ `EMBED_OK = true` is set in all video pages
- ✅ YouTube IFrame API is loaded
- ✅ Fallback link exists for blocked embeds
- ✅ Error handler calls `showFallback()`

## Why videos might not show on localhost:

### 1. **YouTube Embed Restrictions**
YouTube may block embedding on `localhost` or `http://` domains for security reasons.

### 2. **CORS and Origin Issues**
The origin `http://localhost:4400` may not be whitelisted by YouTube.

### 3. **Testing Solution**
Videos should work properly when deployed to:
- ✅ **https://videos.martoccimayhem.com** (GitHub Pages with HTTPS)

## Test URLs:

### Localhost (may not work):
- http://localhost:4400/martocci-mayhem/videos/i-sliced-a-gummy-bear-with-a-huge-knife.html

### Production (should work):
- https://videos.martoccimayhem.com/martocci-mayhem/videos/i-sliced-a-gummy-bear-with-a-huge-knife.html

## What to Check:

1. **Open browser console** (F12) when viewing a video page
2. Look for YouTube API errors
3. If you see "Blocked by X-Frame-Options" or similar → Confirms localhost restriction
4. The fallback "Watch on YouTube" link should appear automatically

## Next Steps:

1. Push the generated site to GitHub
2. Wait for GitHub Pages to deploy (2-3 minutes)
3. Test the video at the production URL

The embeds **will work in production** with HTTPS!

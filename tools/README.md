# Tools

Reusable project scripts live here.

## Sprite Assets

- `extract_gif_frames.py`
  Extracts GIF animations into PNG frame sequences, with optional fixed-canvas normalization for runtime sprites. See `docs/SPRITE_GIF_FRAME_EXTRACTION.md`.
- `render_sprite_gif.py`
  Renders review GIFs from normalized PNG frame sequences.
- `sprite_pipeline_finish_job.py`
  Finishes queued sprite pipeline jobs.

Most sprite scripts expect to run from the repository root:

```powershell
python tools/extract_gif_frames.py --help
```

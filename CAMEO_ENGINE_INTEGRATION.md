# Cameo & Beautify Engine Integration Guide

## System Architecture Overview

The Cameo & Beautify FastAPI backend processes user-uploaded videos through Kling AI and HeyGen APIs to generate high-end modeling outputs.

### Core Components
1. **API Gateway**: Entry point for all client requests
2. **FastAPI Backend**: Core logic, API routing, task management
3. **Task Queue**: Asynchronous processing (Celery with Redis/RabbitMQ)
4. **Kling AI Service**: Initial video beautification/processing
5. **HeyGen Service**: Lipsync, translation, refinement
6. **Object Storage**: S3 for raw uploads and processed videos
7. **Database**: Supabase/Postgres for task metadata
8. **Webhook Service**: Real-time status updates to frontend

## API Routing Schema

### Base URL
```
/api/v1
```

### Endpoints

| HTTP Method | Endpoint | Description | Request | Response | Webhooks |
|---|---|---|---|---|---|
| POST | `/videos/upload` | Initiate video upload and processing | `file: UploadFile, user_id: str` | `task_id: str, status: str` | `video.processing.started` |
| GET | `/videos/{task_id}` | Retrieve processing status and results | None | `task_id: str, status: str, output_url: Optional[str]` | None |
| POST | `/webhooks/kling` | Kling AI callback endpoint | Kling AI Callback Schema | `status: str` | `video.kling.completed, video.kling.failed` |
| POST | `/webhooks/heygen` | HeyGen callback endpoint | HeyGen Webhook Schema | `status: str` | `video.heygen.completed, video.heygen.failed` |

## Data Models (Pydantic)

### VideoUploadRequest
```python
class VideoUploadRequest(BaseModel):
    user_id: str
    file: UploadFile  # Handled directly by FastAPI
```

### VideoTaskResponse
```python
class VideoTaskResponse(BaseModel):
    task_id: str
    status: str  # 'pending', 'processing', 'completed', 'failed'
    output_url: Optional[str] = None
```

### KlingAICallback
```python
class KlingAICallback(BaseModel):
    task_id: str
    status: str  # 'succeed', 'failed'
    video_url: Optional[str] = None
```

### HeyGenCallback
```python
class HeyGenCallback(BaseModel):
    video_id: str
    status: str  # 'completed', 'failed'
    output_url: Optional[str] = None
```

## Workflow Details

### 1. User Upload
- Client uploads video to `/api/v1/videos/upload`
- FastAPI saves raw video to S3
- Creates task entry in database with `pending` status
- Returns `task_id` to client

### 2. Task Enqueue
- Message pushed to task queue containing `task_id` and S3 URL
- Worker picks up task for processing

### 3. Worker Processing
- Retrieves video from S3
- Calls Kling AI API: `POST /v1/videos/omni-video` with video URL and callback URL
- Awaits Kling webhook callback at `/webhooks/kling`
- On success, proceeds to HeyGen if needed
- Calls HeyGen API: `POST /v3/video-translations` or `POST /v3/lipsync` with Kling output
- Awaits HeyGen webhook callback at `/webhooks/heygen`
- Stores final output in S3
- Updates database task status to `completed`
- Sends final webhook to client: `video.processing.completed`

### 4. Status Retrieval
- Client polls `/api/v1/videos/{task_id}` to check processing status
- Returns current status and output URL when ready

## Mobile App Integration Points

### tRPC Routes to Implement
1. `cameo.uploadVideo` - Upload video file and initiate processing
2. `cameo.getStatus` - Poll for processing status
3. `cameo.listProcessed` - List user's completed beautified videos
4. `cameo.deleteVideo` - Remove video from storage

### Frontend Screens
1. **Cameo Studio**: Video upload with camera/gallery picker
2. **Processing Status**: Real-time progress with Kling/HeyGen status
3. **Video Gallery**: Display beautified outputs with download/share options

## Environment Variables Required
```
KLING_ACCESS_KEY=your_key
KLING_SECRET_KEY=your_secret
HEYGEN_API_KEY=your_key
AWS_S3_BUCKET=bucket_name
AWS_ACCESS_KEY_ID=key
AWS_SECRET_ACCESS_KEY=secret
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
BASE_WEBHOOK_URL=https://your-domain.com/api/v1/webhooks
```

## References
- [Kling AI API Docs](https://app.klingai.com/global/dev/document-api)
- [HeyGen API Docs](https://developers.heygen.com/reference/list-video-agent-sessions)

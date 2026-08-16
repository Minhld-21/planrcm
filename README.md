# PlanRCM Frontend

Frontend Next.js App Router + TypeScript + Tailwind CSS cho PlanRCM. Repository này độc lập với NestJS backend.

## SEO sẵn có

- Server-rendered HTML cho nội dung trang chủ
- Metadata, canonical URL và Open Graph
- JSON-LD `WebApplication`
- `robots.txt` và `sitemap.xml` động

## Chạy local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Frontend chạy ở `http://localhost:3001`; yêu cầu `/api/*` được Next.js proxy tới `BACKEND_URL` (mặc định `http://localhost:3000`). Contract itinerary được mirror tại `shared/interfaces/itinerary.interface.ts` để khớp với backend repository.

Người dùng có thể tiếp tục ở chế độ khách hoặc đăng nhập Google. Chế độ khách chỉ tạo một itinerary/24 giờ, không lưu và khóa các nút tùy chỉnh; đăng nhập Google cho phép tạo lại theo package và lưu lịch trình vào Cloud Firestore thông qua backend. Cấu hình OAuth và Firestore nằm hoàn toàn ở `.env` của backend, không đặt client secret ở frontend.

`/plans` là lịch sử riêng tư của tài khoản: người dùng có thể bật/tắt chia sẻ cho từng itinerary. `/market` hiển thị các plan đã được chủ nhân chia sẻ, còn `/market/:planId` là liên kết chi tiết có thể gửi cho người khác. Market chỉ hiển thị tên/avatar công khai của Google và itinerary, không hiển thị email.

Autocomplete ở trang chủ và Market, chi tiết địa điểm, ước lượng khu vực từ vị trí hiện tại và quãng đường Market đều đi qua Gemini ở backend. UI hiển thị rõ đây là dữ liệu ước lượng (`source: "gemini"`); frontend không chứa Google Maps API key. Người dùng có thể chọn ngày khởi hành rồi mở một event đã điền sẵn trong Google Calendar để lưu toàn bộ chuyến đi.

Khi triển khai, cập nhật `NEXT_PUBLIC_SITE_URL` thành domain public thật để canonical URL và sitemap chính xác.

## Kiểm tra

```bash
npm run lint
npm run typecheck
npm run build
```
# planrcm

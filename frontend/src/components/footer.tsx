import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">MovieStream</h3>
            <p className="text-sm text-muted-foreground">
              Trải nghiệm xem phim tuyệt vời nhất với chất lượng cao và đa dạng nội dung.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Liên kết nhanh</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm hover:underline">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/phim-moi" className="text-sm hover:underline">
                  Phim mới
                </Link>
              </li>
              <li>
                <Link href="/phim-hot" className="text-sm hover:underline">
                  Phim hot
                </Link>
              </li>
              <li>
                <Link href="/the-loai" className="text-sm hover:underline">
                  Thể loại
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Hỗ trợ</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-sm hover:underline">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/lien-he" className="text-sm hover:underline">
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link href="/dieu-khoan" className="text-sm hover:underline">
                  Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link href="/chinh-sach" className="text-sm hover:underline">
                  Chính sách bảo mật
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Kết nối với chúng tôi</h4>
            <div className="flex space-x-4">
              <Link href="#" className="text-foreground hover:text-primary">
                <Facebook size={20} />
              </Link>
              <Link href="#" className="text-foreground hover:text-primary">
                <Instagram size={20} />
              </Link>
              <Link href="#" className="text-foreground hover:text-primary">
                <Twitter size={20} />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} MovieStream. Tất cả các quyền được bảo lưu.
        </div>
      </div>
    </footer>
  )
}


export default function PrivacyPage() {
  return (
    <main className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-ink text-paper">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="eyebrow font-mono text-accent font-semibold block mb-2">
            Privacy Policy
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-paper tracking-tight">
            นโยบายความเป็นส่วนตัว
          </h1>
          <p className="text-sm text-line/60 mt-2 max-w-lg mx-auto">
            ข้อกำหนดและความโปร่งใสในการดูแลรักษาข้อมูลส่วนบุคคลของคุณ
          </p>
        </div>

        {/* Content Card */}
        <div className="max-w-3xl mx-auto rounded-[20px] border border-white/10 bg-night/80 p-8 sm:p-10 space-y-6 shadow-xl">
          <section>
            <h2 className="text-lg font-semibold text-paper mb-2">
              ข้อมูลที่เราเก็บ
            </h2>
            <p className="text-sm text-line/80 leading-relaxed">
              เมื่อคุณจองคิวผ่านเว็บไซต์นี้ เราจะเก็บข้อมูลดังนี้: ชื่อ-นามสกุล, เบอร์โทรศัพท์, ทรงผมที่เลือก, วันเวลาที่จอง และช่างที่เลือก
            </p>
          </section>

          <div className="h-px bg-white/10" />

          <section>
            <h2 className="text-lg font-semibold text-paper mb-2">
              วัตถุประสงค์ในการเก็บข้อมูล
            </h2>
            <p className="text-sm text-line/80 leading-relaxed">
              เราใช้ข้อมูลนี้เพื่อยืนยันคิว ติดต่อแจ้งเตือนหรือสอบถามเกี่ยวกับการจอง และจัดตารางคิวของช่างในร้านเท่านั้น เราไม่นำข้อมูลของคุณไปขายหรือส่งต่อให้บุคคลภายนอก
            </p>
          </section>

          <div className="h-px bg-white/10" />

          <section>
            <h2 className="text-lg font-semibold text-paper mb-2">
              ระยะเวลาการเก็บข้อมูล
            </h2>
            <p className="text-sm text-line/80 leading-relaxed">
              เราเก็บข้อมูลการจองไว้เพื่อใช้อ้างอิงประวัติลูกค้าของร้าน คุณสามารถขอให้ลบข้อมูลของคุณได้ทุกเมื่อตามช่องทางติดต่อด้านล่าง
            </p>
          </section>

          <div className="h-px bg-white/10" />

          <section>
            <h2 className="text-lg font-semibold text-paper mb-2">
              สิทธิของเจ้าของข้อมูล
            </h2>
            <p className="text-sm text-line/80 leading-relaxed">
              คุณมีสิทธิ์ขอเข้าถึง แก้ไข หรือลบข้อมูลส่วนบุคคลของคุณได้ โดยติดต่อร้านผ่านช่องทางด้านล่าง
            </p>
          </section>

          <div className="h-px bg-white/10" />

          <section>
            <h2 className="text-lg font-semibold text-paper mb-2">ติดต่อเรา</h2>
            <p className="text-sm text-line/80 leading-relaxed">
              หากมีคำถามเกี่ยวกับข้อมูลส่วนบุคคลของคุณ ติดต่อได้ที่ [ใส่เบอร์โทรหรือ LINE ของร้าน]
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
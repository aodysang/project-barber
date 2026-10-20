export default function PrivacyPage() {
  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">นโยบายความเป็นส่วนตัว</h1>

      <div className="space-y-5 text-gray-700 leading-relaxed">
        <section>
          <h2 className="font-semibold text-black mb-1">
            ข้อมูลที่เราเก็บ
          </h2>
          <p>เมื่อคุณจองคิวผ่านเว็บไซต์นี้ เราจะเก็บข้อมูลดังนี้: ชื่อ-นามสกุล, เบอร์โทรศัพท์, ทรงผมที่เลือก, วันเวลาที่จอง และช่างที่เลือก</p>
        </section>

        <section>
          <h2 className="font-semibold text-black mb-1">
            วัตถุประสงค์ในการเก็บข้อมูล
          </h2>
          <p>เราใช้ข้อมูลนี้เพื่อยืนยันคิว ติดต่อแจ้งเตือนหรือสอบถามเกี่ยวกับการจอง และจัดตารางคิวของช่างในร้านเท่านั้น เราไม่นำข้อมูลของคุณไปขายหรือส่งต่อให้บุคคลภายนอก</p>
        </section>

        <section>
          <h2 className="font-semibold text-black mb-1">
            ระยะเวลาการเก็บข้อมูล
          </h2>
          <p>เราเก็บข้อมูลการจองไว้เพื่อใช้อ้างอิงประวัติลูกค้าของร้าน คุณสามารถขอให้ลบข้อมูลของคุณได้ทุกเมื่อตามช่องทางติดต่อด้านล่าง</p>
        </section>

        <section>
          <h2 className="font-semibold text-black mb-1">
            สิทธิของเจ้าของข้อมูล
          </h2>
          <p>คุณมีสิทธิ์ขอเข้าถึง แก้ไข หรือลบข้อมูลส่วนบุคคลของคุณได้ โดยติดต่อร้านผ่านช่องทางด้านล่าง</p>
        </section>

        <section>
          <h2 className="font-semibold text-black mb-1">ติดต่อเรา</h2>
          <p>
            หากมีคำถามเกี่ยวกับข้อมูลส่วนบุคคลของคุณ ติดต่อได้ที่ [ใส่เบอร์โทรหรือ LINE ของร้าน]
          </p>
        </section>
      </div>
    </main>
  );
}
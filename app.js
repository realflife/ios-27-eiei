import { createApp, computed, ref, watch, onMounted } from './vendor/vue.esm-browser.prod.js';

createApp({
  setup() {
    const activeCategory = ref('all');
    const expandedFeature = ref(null);
    const selectedDevice = ref('iPhone 15 Pro');
    const reducedMotion = ref(window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    const signals = ['SIRI AI', 'SPATIAL REFRAME', 'SAFARI NOTIFY ME', 'GYMKIT', 'LIQUID GLASS', 'CHILD SAFETY'];
    const categories = [
      { id: 'all', label: 'ทั้งหมด', symbol: '✦' },
      { id: 'ai', label: 'Apple Intelligence', symbol: '◉' },
      { id: 'apps', label: 'แอปและเครื่องมือ', symbol: '⌘' },
      { id: 'system', label: 'ระบบ', symbol: '⚡' },
      { id: 'safety', label: 'ความปลอดภัย', symbol: '◇' },
    ];

    const features = [
      { category: 'ai', title: 'Siri AI', symbol: '◉', tone: 'blue', summary: 'ผู้ช่วยที่คุยต่อเนื่อง เข้าใจบริบทส่วนตัว และทำงานในแอปแทนคุณได้', detail: 'ค้นหารูปหรืออีเมลจากคำบรรยาย สร้างนัดหมาย ส่งข้อความ เพิ่มเพลง และตอบคำถามจากข้อมูลออนไลน์ได้จากคำขอเดียว', limit: 'เปิดตัวเป็นภาษาอังกฤษก่อน และมีข้อจำกัดการใช้งานบางส่วน' },
      { category: 'ai', title: 'Visual Intelligence', symbol: '◎', tone: 'violet', summary: 'ถามสิ่งที่กล้องกำลังมองเห็น แล้วค้นข้อมูลหรือทำงานต่อได้ทันที', detail: 'ใช้ Siri mode ในกล้องเพื่อระบุวัตถุ อ่านข้อมูล และเชื่อมไปสู่การค้นหาหรือคำสั่งที่เกี่ยวข้อง', limit: 'ต้องใช้อุปกรณ์ที่รองรับ Apple Intelligence' },
      { category: 'ai', title: 'Photo Intelligence', symbol: '▧', tone: 'pink', summary: 'จัดเฟรมใหม่ ขยายภาพ และลบวัตถุขนาดใหญ่ด้วยเครื่องมือ AI', detail: 'Spatial Reframing ช่วยเปลี่ยนองค์ประกอบหลังถ่าย ส่วน Extend เติมพื้นที่รอบภาพ และ Clean Up ลบสิ่งรบกวน', limit: 'ผลลัพธ์ขึ้นอยู่กับภาพต้นฉบับและรุ่นอุปกรณ์' },
      { category: 'apps', title: 'Safari Notify Me', symbol: '⌁', tone: 'cyan', summary: 'ติดตามหน้าเว็บและแจ้งเมื่อมีการเปลี่ยนแปลง เช่น ราคาหรือสินค้ากลับมา', detail: 'Safari ยังจัดกลุ่มแท็บตามหัวข้ออัตโนมัติ ช่วยลดความรกและกลับไปหางานเดิมได้เร็วขึ้น' },
      { category: 'apps', title: 'Smart Suggestions', symbol: '✣', tone: 'blue', summary: 'Messages และ Mail เสนอการทำงานจากบริบทของข้อความโดยไม่ต้องคัดลอกข้อมูล', detail: 'เพิ่มกิจกรรมลงปฏิทิน สร้างโน้ตหรือรายการเตือน และค้นหารูปที่เกี่ยวข้องได้ด้วยการแตะครั้งเดียว', limit: 'คำแนะนำบางประเภทเปิดใช้ในภาษาอังกฤษก่อน' },
      { category: 'apps', title: 'Passwords', symbol: '⌾', tone: 'green', summary: 'ตรวจรหัสผ่านที่อ่อนแอหรือรั่วไหล และช่วยอัปเกรดให้ปลอดภัยขึ้น', detail: 'รวมการแจ้งเตือนความเสี่ยงไว้ในแอป Passwords และลดขั้นตอนการแก้รหัสผ่านสำหรับบริการที่รองรับ', limit: 'การอัปเดตรหัสผ่านอัตโนมัติจะมาในซอฟต์แวร์อัปเดตภายหลัง' },
      { category: 'system', title: 'Liquid Glass', symbol: '◫', tone: 'violet', summary: 'ปรับดีไซน์ให้คอนทราสต์ชัดขึ้น พร้อมเลือกระดับความโปร่งใสได้', detail: 'ไอคอนคมชัดขึ้น การหักเหของพื้นผิวสม่ำเสมอ และมีตัวเลื่อนตั้งแต่ใสไปจนถึงแบบมีสีเข้ม' },
      { category: 'system', title: 'Smarter Connectivity', symbol: '⇄', tone: 'cyan', summary: 'สลับระหว่าง Wi‑Fi และเครือข่ายมือถือได้ราบรื่นกว่าเดิม', detail: 'ช่วยรักษาความต่อเนื่องของเส้นทาง แฮนด์ออฟงาน และสาย FaceTime เมื่อเคลื่อนที่ออกจากพื้นที่เครือข่าย' },
      { category: 'system', title: 'GymKit on iPhone', symbol: '⌁', tone: 'green', summary: 'เชื่อมต่อเครื่องคาร์ดิโอที่รองรับเพื่อดูข้อมูลการออกกำลังกายแบบเรียลไทม์', detail: 'รองรับอุปกรณ์อย่างลู่วิ่ง จักรยาน เครื่องเดินวงรี และเครื่องขึ้นบันได รวมถึงข้อมูลชีพจรจาก AirPods Pro 3' },
      { category: 'safety', title: 'Child Safety', symbol: '◇', tone: 'pink', summary: 'เครื่องมือผู้ปกครองที่เข้าใจง่ายขึ้น ช่วยให้เด็กใช้งานออนไลน์อย่างเหมาะสม', detail: 'ช่วยจัดการคำขอ การสื่อสาร และประสบการณ์ดิจิทัลของเด็กจากจุดควบคุมที่ชัดเจนขึ้น' },
      { category: 'safety', title: 'Home Intelligence', symbol: '⌂', tone: 'blue', summary: 'สรุปเหตุการณ์จากบ้านและค้นคลิปกล้อง HomeKit ด้วยภาษาธรรมชาติ', detail: 'รวมการแจ้งเตือนที่เกี่ยวข้อง อธิบายสิ่งที่เกิดขึ้นก่อนเปิดคลิป และรองรับกล้องที่สตรีมหรือบันทึกภาพ 4K', limit: 'ต้องใช้ HomeKit Secure Video และอุปกรณ์ที่รองรับ' },
      { category: 'apps', title: 'AirPods Custom EQ', symbol: '∿', tone: 'violet', summary: 'ปรับเสียงต่ำ กลาง และสูงได้โดยตรงจากการตั้งค่า AirPods', detail: 'ช่วยปรับบุคลิกเสียงให้เข้ากับเพลง พอดแคสต์ หรือความชอบด้านการฟังของแต่ละคน' },
    ];

    const devices = [
      { name: 'iPhone 16 และใหม่กว่า', status: 'full' },
      { name: 'iPhone 15 Pro', status: 'full' },
      { name: 'iPhone 15', status: 'system' },
      { name: 'iPhone 14', status: 'system' },
      { name: 'iPhone 13', status: 'system' },
      { name: 'iPhone 12', status: 'system' },
      { name: 'iPhone 11', status: 'system' },
      { name: 'iPhone SE รุ่นที่ 2 หรือใหม่กว่า', status: 'system' },
      { name: 'iPhone XS / XR หรือเก่ากว่า', status: 'none' },
    ];

    const filteredFeatures = computed(() => activeCategory.value === 'all' ? features.slice(0, 6) : features.filter(item => item.category === activeCategory.value));
    const deviceResult = computed(() => {
      const device = devices.find(item => item.name === selectedDevice.value) || devices[1];
      if (device.status === 'full') return { status: 'full', kicker: 'FULL EXPERIENCE', title: 'รองรับ iOS 27 และ AI รุ่นใหม่', description: 'ใช้งานระบบหลักพร้อม Siri AI และ Apple Intelligence รุ่นใหม่ได้ตามภาษาและภูมิภาคที่รองรับ' };
      if (device.status === 'system') return { status: 'system', kicker: 'CORE EXPERIENCE', title: 'รองรับ iOS 27', description: 'ได้รับการปรับปรุงระบบ ความปลอดภัย และแอปหลัก แต่ฟีเจอร์ Apple Intelligence รุ่นใหม่อาจไม่ครบ' };
      return { status: 'none', kicker: 'NOT SUPPORTED', title: 'ไม่รองรับ iOS 27', description: 'รุ่นนี้ไม่อยู่ในรายชื่ออุปกรณ์ที่รองรับ ควรใช้ iOS เวอร์ชันล่าสุดที่มีให้สำหรับเครื่อง' };
    });

    function toggleFeature(title) { expandedFeature.value = expandedFeature.value === title ? null : title; }
    watch(activeCategory, () => { expandedFeature.value = null; });

    onMounted(async () => {
      try {
      const THREE = await import('./vendor/three.module.js');
      const canvas = document.querySelector('#ios-orb');
      const host = canvas.parentElement;
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
      camera.position.z = 6.7;

      const group = new THREE.Group();
      scene.add(group);
      const coreGeometry = new THREE.IcosahedronGeometry(1.62, 6);
      const coreMaterial = new THREE.MeshPhysicalMaterial({ color: 0x758cff, metalness: 0.05, roughness: 0.17, transmission: 0.66, thickness: 1.6, ior: 1.35, transparent: true, opacity: .94, iridescence: 0.85, iridescenceIOR: 1.25 });
      const core = new THREE.Mesh(coreGeometry, coreMaterial);
      group.add(core);

      const wire = new THREE.Mesh(new THREE.IcosahedronGeometry(1.8, 2), new THREE.MeshBasicMaterial({ color: 0xbec8ff, wireframe: true, transparent: true, opacity: .12 }));
      group.add(wire);
      const ringMaterial = new THREE.MeshBasicMaterial({ color: 0x7ef4ff, transparent: true, opacity: .34, side: THREE.DoubleSide });
      const rings = [2.3, 2.75].map((radius, index) => {
        const ring = new THREE.Mesh(new THREE.RingGeometry(radius, radius + .012, 160), ringMaterial.clone());
        ring.rotation.x = Math.PI / (2.6 + index);
        ring.rotation.y = .45 + index * .7;
        group.add(ring);
        return ring;
      });
      const particlesGeometry = new THREE.BufferGeometry();
      const positions = [];
      for (let i = 0; i < 250; i += 1) {
        const radius = 2.4 + Math.random() * 2.6;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        positions.push(radius * Math.sin(phi) * Math.cos(theta), radius * Math.sin(phi) * Math.sin(theta), radius * Math.cos(phi));
      }
      particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      const particles = new THREE.Points(particlesGeometry, new THREE.PointsMaterial({ color: 0xa7b8ff, size: .014, transparent: true, opacity: .62 }));
      group.add(particles);

      const key = new THREE.PointLight(0x86dfff, 32, 15); key.position.set(3, 3, 4); scene.add(key);
      const fill = new THREE.PointLight(0xff79cc, 25, 14); fill.position.set(-3, -1, 3); scene.add(fill);
      const rim = new THREE.PointLight(0x8f6cff, 20, 12); rim.position.set(0, -4, -1); scene.add(rim);
      scene.add(new THREE.AmbientLight(0xffffff, 1.2));

      let pointerX = 0; let pointerY = 0;
      const onPointer = event => {
        const rect = host.getBoundingClientRect();
        pointerX = ((event.clientX - rect.left) / rect.width - .5) * .7;
        pointerY = ((event.clientY - rect.top) / rect.height - .5) * .7;
      };
      host.addEventListener('pointermove', onPointer);
      const resize = () => {
        const { width, height } = host.getBoundingClientRect();
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };
      resize(); window.addEventListener('resize', resize);

      const clock = new THREE.Clock();
      const animate = () => {
        const time = clock.getElapsedTime();
        if (!reducedMotion.value) {
          group.rotation.y += (pointerX - group.rotation.y) * .035;
          group.rotation.x += (-pointerY - group.rotation.x) * .035;
          core.rotation.z = time * .08;
          wire.rotation.y = -time * .12;
          rings[0].rotation.z = time * .06;
          rings[1].rotation.z = -time * .04;
          particles.rotation.y = time * .025;
          group.position.y = Math.sin(time * .7) * .08;
        }
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      };
      animate();
      } catch (error) {
        console.warn('3D unavailable; page content remains accessible.', error);
      }
    });

    return { signals, categories, activeCategory, filteredFeatures, expandedFeature, toggleFeature, devices, selectedDevice, deviceResult, reducedMotion };
  }
}).mount('#app');

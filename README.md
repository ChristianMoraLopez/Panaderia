# 🍯 BeeVoven Bakery

<div align="center">

![BeeVoven Logo](/images/SVG/LogoOnPurple.svg)

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)

🌟 Una tienda en línea artesanal para productos de panadería y repostería excepcionales 🥐

[Ver Demo](https://beevoven.com) • [Reportar Bug](https://github.com/yourusername/beevoven/issues) • [Solicitar Feature](https://github.com/yourusername/beevoven/issues)

</div>

## ✨ Características

- 🛒 Carrito de compras con persistencia local
- 🔐 Autenticación y gestión de usuarios
- 💳 Integración con pasarela de pagos
- 📱 Diseño responsive y animaciones fluidas
- 🌈 Tema personalizado y consistente
- 📧 Notificaciones por correo electrónico
- 🔍 Búsqueda y filtrado de productos
- 📦 Seguimiento de pedidos

## 🚀 Tecnologías

- **Frontend:**
  - Next.js 14
  - React 18
  - TypeScript
  - Tailwind CSS
  - Framer Motion
  - Lucide Icons
  - Shadcn/UI

- **Backend:**
  - Contentful CMS
  - Node.js
  - Next.js API Routes

- **Testing:**
  - Jest
  - React Testing Library

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/yourusername/beevoven.git
```

2. Instala las dependencias:
```bash
cd beevoven
npm install
```

3. Configura las variables de entorno:
```bash
cp .env.example .env.local
```

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

## 🔧 Variables de Entorno

Para ejecutar este proyecto, necesitarás añadir las siguientes variables de entorno a tu archivo `.env.local`:

```env
# Contentful
CONTENTFUL_SPACE_ID=tu_space_id
CONTENTFUL_ACCESS_TOKEN=tu_access_token
CONTENTFUL_PREVIEW_ACCESS_TOKEN=tu_preview_token

# Email
SMTP_HOST=tu_smtp_host
SMTP_PORT=tu_smtp_port
SMTP_USER=tu_smtp_user
SMTP_PASSWORD=tu_smtp_password

# Pasarela de Pagos
PAYMENT_API_KEY=tu_api_key
PAYMENT_SECRET_KEY=tu_secret_key
```

## 📚 Estructura del Proyecto

```
beevoven/
├── components/           # Componentes React reutilizables
├── hooks/               # Custom hooks
├── pages/               # Páginas y rutas de la aplicación
├── public/              # Archivos estáticos
├── styles/              # Estilos globales y configuración de Tailwind
├── types/               # Definiciones de tipos TypeScript
├── utils/               # Funciones utilitarias
└── store/              # Estado global de la aplicación
```

## 🔒 Tipos TypeScript

### Interfaces Principales

```typescript
interface ProductFields {
  name: string;
  description: string;
  price: number;
  image: {
    fields: {
      file: {
        url: string;
      };
    };
  };
  category: string;
}

interface CartItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  quantity: number;
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductFields | null;
  language: 'es' | 'en';
  addToCart: (item: CartItem) => void;
}

interface ProductDetails {
  name: string;
  price: number;
  description: string;
  imageId: string;
  quantity: number;
}
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu Feature Branch:
```bash
git checkout -b feature/AmazingFeature
```
3. Commit tus cambios:
```bash
git commit -m 'feat: Add some AmazingFeature'
```
4. Push a la Branch:
```bash
git push origin feature/AmazingFeature
```
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Contacto

BeeVoven Bakery - [@beevoven](https://twitter.com/beevoven)

Email: contacto@beevovenbakery.com

Teléfono: +1 (786) 280-0961

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Contentful](https://www.contentful.com/)
- [Shadcn/UI](https://ui.shadcn.com/)

export const BUSINESS_CONFIG = {
  name: "JULIPOP",
  subtitle: "REPOSTERÍA",
  slogan: "Roles de canela recién horneados, suaves por dentro y cubiertos con tus ingredientes favoritos.",
  // Cambia este número por el WhatsApp real del negocio (código de país 52 + 10 dígitos)
  whatsappNumber: "5215512345678",
  currency: "MXN"
};

// Toppings Frutales (+$10 MXN c/u)
export const FRUIT_TOPPINGS = [
  { id: "fresa", name: "Fresa natural", price: 10, category: "frutal", icon: "🍓" },
  { id: "durazno", name: "Durazno en almíbar", price: 10, category: "frutal", icon: "🍑" },
  { id: "mermelada", name: "Mermelada natural", price: 10, category: "frutal", icon: "🫙" }
];

// Toppings Adicionales (+$7 MXN c/u)
export const EXTRA_TOPPINGS = [
  { id: "almendra", name: "Almendra fileteada", price: 7, category: "adicional", icon: "🌰" },
  { id: "nuez", name: "Nuez troceada", price: 7, category: "adicional", icon: "🥜" },
  { id: "nutella", name: "Extra Nutella", price: 7, category: "adicional", icon: "🍫" }
];

// Catálogo de Roles de Canela
export const PRODUCTS = [
  {
    id: "rol-glaseado",
    name: "Rol de canela glaseado",
    category: "clasico",
    badge: "Base ideal para personalizar",
    price: 55,
    description: "Nuestro clásico rol artesanal recién horneado con canela selecta y generoso glaseado cremoso de la casa.",
    image: "./public/images/rol-de-canela.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=900&q=80",
    featured: true
  },
  {
    id: "rol-oreo",
    name: "Rol Oreo",
    category: "especial",
    badge: "Favorito",
    price: 65,
    description: "Rol esponjoso cubierto con glaseado cremoso, trozos crujientes de galleta Oreo y drizzle de chocolate.",
    image: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=900&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=900&q=80",
    featured: false
  },
  {
    id: "rol-lotus",
    name: "Rol galleta Lotus",
    category: "especial",
    badge: "Especialidad",
    price: 70,
    description: "Cubierto con glaseado suave, crumble de galleta caramelizada Biscoff y coronado con una galleta Lotus entera.",
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=900&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=900&q=80",
    featured: true
  },
  {
    id: "rol-nutella-ferrero-nuez",
    name: "Rol de Nutella, Ferrero y nuez",
    category: "especial",
    badge: "Premium",
    price: 75,
    description: "La combinación definitiva para amantes del chocolate: glaseado, hilos de Nutella, trozos de nuez y bombón Ferrero Rocher.",
    image: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=900&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=900&q=80",
    featured: true
  },
  {
    id: "rol-nutella-fresa-nuez",
    name: "Rol de Nutella, fresa y nuez",
    category: "especial",
    badge: "Más vendido",
    price: 70,
    description: "El equilibrio perfecto: glaseado artesanal decorado con Nutella, fresas frescas picadas y nuez selecta.",
    image: "./public/images/rol-de-canela.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80",
    featured: true
  },
  {
    id: "rol-raffaello",
    name: "Rol de Raffaello",
    category: "especial",
    badge: "Delicado",
    price: 65,
    description: "Suave cobertura cremosa con lluvia de coco rallado, almendra fileteada y bombón Raffaello.",
    image: "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=900&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=900&q=80",
    featured: false
  }
];
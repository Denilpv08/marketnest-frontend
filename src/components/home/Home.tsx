"use client";
import Link from "next/link";
import PublicLayout from "@/components/layout/PublicLayout";
import { MdStorefront, MdDeliveryDining, MdPayment } from "react-icons/md";
import {
  FiArrowRight,
  FiShoppingBag,
  FiCalendar,
  FiStar,
} from "react-icons/fi";

const Home = () => {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-linear-to-br from-blue-600 to-indigo-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Tu negocio en línea,{" "}
            <span className="text-blue-200">más fácil que nunca</span>
          </h1>
          <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Crea tu tienda, vende productos, ofrece servicios y agenda citas.
            Todo en un solo lugar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              Crear mi tienda gratis
              <FiArrowRight />
            </Link>
            <Link
              href="/stores"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              Ver tiendas
              <FiShoppingBag />
            </Link>
          </div>
        </div>
      </section>

      {/* Características */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Todo lo que necesita tu negocio
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Una plataforma completa para gestionar tu negocio desde cualquier
              lugar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6">
              <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MdStorefront className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Tu tienda personalizada
              </h3>
              <p className="text-gray-500 text-sm">
                Personaliza colores, logo y banner. Tu marca, tu identidad.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6">
              <div className="bg-green-100 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FiCalendar className="text-green-600 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Agenda de citas
              </h3>
              <p className="text-gray-500 text-sm">
                Permite que tus clientes agenden citas directamente desde tu
                tienda.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6">
              <div className="bg-purple-100 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MdPayment className="text-purple-600 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Pagos seguros
              </h3>
              <p className="text-gray-500 text-sm">
                Integración con Stripe para recibir pagos de forma segura.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="text-center p-6">
              <div className="bg-yellow-100 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FiStar className="text-yellow-600 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Productos y servicios
              </h3>
              <p className="text-gray-500 text-sm">
                Vende productos físicos, ofrece servicios o ambos a la vez.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="text-center p-6">
              <div className="bg-red-100 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MdDeliveryDining className="text-red-600 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Gestión de órdenes
              </h3>
              <p className="text-gray-500 text-sm">
                Controla el estado de cada orden desde tu panel de
                administración.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="text-center p-6">
              <div className="bg-indigo-100 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FiShoppingBag className="text-indigo-600 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Inventario en tiempo real
              </h3>
              <p className="text-gray-500 text-sm">
                Controla tu stock y recibe alertas cuando un producto esté por
                agotarse.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para hacer crecer tu negocio?
          </h2>
          <p className="text-gray-400 mb-8">
            Únete a los negocios que ya confían en MarketNest. Empieza gratis
            hoy.
          </p>
          <Link
            href="/auth/register"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors inline-flex items-center gap-2"
          >
            Comenzar ahora
            <FiArrowRight />
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
};

export default Home;

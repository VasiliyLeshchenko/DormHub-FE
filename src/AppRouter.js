import React from 'react';
import {Route, Routes} from "react-router-dom";
import Dorms from "./pages/dorm/Dorms";
import DormDetails from "./pages/dorm/DormDetails";
import DormNew from "./pages/dorm/DormNew";
import DormEdit from "./pages/dorm/DormEdit";
import Apartments from "./pages/apartment/Apartments";
import ApartmentNew from "./pages/apartment/ApartmentNew";
import ApartmentDetails from "./pages/apartment/ApartmentDetails";
import ApartmentEdit from "./pages/apartment/ApartmentEdit";
import StafferNew from "./pages/staffer/StafferNew";
import StafferDetails from "./pages/staffer/StafferDetails";
import Staffers from "./pages/staffer/Staffers";
import StafferEdit from "./pages/staffer/StafferEdit";
import Tenants from "./pages/tenant/Tenants";
import TenantNew from "./pages/tenant/TenantNew";
import TenantDetails from "./pages/tenant/TenantDetails";
import TenantEdit from "./pages/tenant/TenantEdit";
import Login from "./pages/Login";
import PrivateRoute from "./PrivateRoute";
import Orders from "./pages/order/Orders";
import OrderNew from "./pages/order/OrderNew";
import OrderDetails from "./pages/order/OrderDetails";
import OrderEdit from "./pages/order/OrderEdit";
import Equipments from "./pages/equipment/Equipments";
import EquipmentNew from "./pages/equipment/EquipmentNew";
import EquipmentDetails from "./pages/equipment/EquipmentDetails";
import EquipmentEdit from "./pages/equipment/EquipmentEdit";
import Duties from "./pages/duty/Duties";
import DutyNew from "./pages/duty/DutyNew";
import DutyDetails from "./pages/duty/DutyDetails";
import DutyEdit from "./pages/duty/DutyEdit";
import EquipmentLocationForm from "./components/form/EquipmentLocationForm";
import EquipmentLocations from "./pages/equipment/location/EquipmentLocations";
import EquipmentLocationNew from "./pages/equipment/location/EquipmentLocationNew";
import EquipmentLocationEdit from "./pages/equipment/location/EquipmentLocationEdit";
import EquipmentLocationDetails from "./pages/equipment/location/EquipmentLocationDetails";


function AppRouter() {
    return (
         <Routes>
             <Route element={<PrivateRoute />}>
                 <Route path="/" element={<Dorms />} />
                 <Route path="/home" element={<Dorms />} />
                 <Route path="/dorms" element={<Dorms />} />
                 <Route path="/dorms/new" element={<DormNew />} />
                 <Route path="/dorms/:id" element={<DormDetails />} />
                 <Route path="/dorms/:id/edit" element={<DormEdit />} />
                 <Route path="/apartments" element={<Apartments />} />
                 <Route path="/apartments/new" element={<ApartmentNew />} />
                 <Route path="/apartments/:id" element={<ApartmentDetails />} />
                 <Route path="/apartments/:id/edit" element={<ApartmentEdit />} />
                 <Route path="/staffers" element={<Staffers />} />
                 <Route path="/staffers/new" element={<StafferNew />} />
                 <Route path="/staffers/:id" element={<StafferDetails />} />
                 <Route path="/staffers/:id/edit" element={<StafferEdit />} />
                 <Route path="/tenants" element={<Tenants />} />
                 <Route path="/tenants/new" element={<TenantNew />} />
                 <Route path="/tenants/:id" element={<TenantDetails />} />
                 <Route path="/tenants/:id/edit" element={<TenantEdit />} />
                 <Route path="/orders" element={<Orders />} />
                 <Route path="/orders/new" element={<OrderNew />} />
                 <Route path="/orders/:id" element={<OrderDetails />} />
                 <Route path="/orders/:id/edit" element={<OrderEdit />} />
                 <Route path="/equipments" element={<Equipments />} />
                 <Route path="/equipments/new" element={<EquipmentNew />} />
                 <Route path="/equipments/:id" element={<EquipmentDetails />} />
                 <Route path="/equipments/:id/edit" element={<EquipmentEdit />} />
                 <Route path="/equipment-locations" element={<EquipmentLocations />} />
                 <Route path="/equipment-locations/new" element={<EquipmentLocationNew />} />
                 <Route path="/equipment-locations/:id" element={<EquipmentLocationDetails />} />
                 <Route path="/equipment-locations/:id/edit" element={<EquipmentLocationEdit />} />
                 <Route path="/duties" element={<Duties />} />
                 <Route path="/duties/new" element={<DutyNew />} />
                 <Route path="/duties/:id" element={<DutyDetails />} />
                 <Route path="/duties/:id/edit" element={<DutyEdit />} />
             </Route>
             <Route path="/login" element={<Login />} />
         </Routes>
    );
}

export default AppRouter;
/**
 * 路由组件出口文件
 * yezi 2018年6月24日
 */
import Loadable from 'react-loadable';
import { ApplyBuildingList } from '../shentuan/building/apply/ApplyBuildingList';
import { BuildingList } from '../shentuan/building/list/BuildingList';
import { Payment } from '../shentuan/merchant/payment/Payment';
import { MerchantSettleList } from '../shentuan/merchant/shettle_list/MerchantSettleList';
import BasicAnimations from './animation/BasicAnimations';
import ExampleAnimations from './animation/ExampleAnimations';
import AuthBasic from './auth/Basic';
import RouterEnter from './auth/RouterEnter';
import Echarts from './charts/Echarts';
import Recharts from './charts/Recharts';
import Cssmodule from './cssmodule';
import Dashboard from './dashboard/Dashboard';
import MultipleMenu from './extension/MultipleMenu';
import QueryParams from './extension/QueryParams';
import Visitor from './extension/Visitor';
import BasicForm from './forms/BasicForm';
import Sub1 from './smenu/Sub1';
import Sub2 from './smenu/Sub2';
import AdvancedTable from './tables/AdvancedTables';
import AsynchronousTable from './tables/AsynchronousTable';
import BasicTable from './tables/BasicTables';
import Banners from './ui/banners';
import Buttons from './ui/Buttons';
import Drags from './ui/Draggable';
import Gallery from './ui/Gallery';
import Icons from './ui/Icons';
import MapUi from './ui/map';
import Modals from './ui/Modals';
import Notifications from './ui/Notifications';
import Spins from './ui/Spins';
import Tabs from './ui/Tabs';
import Loading from './widget/Loading';

const WysiwygBundle = Loadable({
    // 按需加载富文本配置
    loader: () => import('./ui/Wysiwyg'),
    loading: Loading,
});

export default {
    Payment,
    MerchantSettleList,
    ApplyBuildingList,
    BuildingList,
    BasicForm,
    BasicTable,
    AdvancedTable,
    AsynchronousTable,
    Echarts,
    Recharts,
    Icons,
    Buttons,
    Spins,
    Modals,
    Notifications,
    Tabs,
    Banners,
    Drags,
    Dashboard,
    Gallery,
    BasicAnimations,
    ExampleAnimations,
    AuthBasic,
    RouterEnter,
    WysiwygBundle,
    Cssmodule,
    MapUi,
    QueryParams,
    Visitor,
    MultipleMenu,
    Sub1,
    Sub2,
} as any;

import { createRoot } from "react-dom/client";
import "antd/dist/reset.css";
import { ConfigProvider, theme } from "antd";
import zhCN from "antd/locale/zh_CN";
import { RouterProvider } from "react-router-dom";
import routes from "./router/index.jsx";
import { Provider } from "react-redux";
import store from "./store/index";

createRoot(document.getElementById("root")).render(
  <ConfigProvider
    locale={zhCN}
    theme={{
      algorithm: theme.defaultAlgorithm,
    }}
  >
    <Provider store={store}>
      <RouterProvider router={routes} />
    </Provider>
  </ConfigProvider>
);

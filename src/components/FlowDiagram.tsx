import {
  ArrowDown,
  ArrowRight,
  AlertTriangle,
  Check,
  Database,
  Mail,
  ScanSearch,
  Store,
  Workflow,
} from 'lucide-react'

export function FlowDiagram() {
  return (
    <div
      className="flow-graphic"
      aria-label="Данные из CRM, почты и сайта поступают в сервис Altacod, который связывает их с 1С и предупреждает о падении маржи через Radar"
    >
      <div className="flow-topline">
        <span className="flow-live">
          <span className="live-pulse" /> СИСТЕМЫ СВЯЗАНЫ
        </span>
        <span>01 / ПОТОК ДАННЫХ</span>
      </div>
      <div className="flow-sources">
        <div className="flow-source">
          <Database size={19} />
          <span>CRM</span>
        </div>
        <div className="flow-source">
          <Mail size={19} />
          <span>Почта</span>
        </div>
        <div className="flow-source">
          <Store size={19} />
          <span>Сайт</span>
        </div>
      </div>
      <div className="flow-join" aria-hidden="true">
        <span />
        <span />
        <span />
        <i />
      </div>
      <div className="flow-service">
        <div className="flow-service-icon">
          <Workflow size={25} />
        </div>
        <div>
          <small>ЛОГИКА И ИНТЕГРАЦИИ</small>
          <strong>Altacod Service</strong>
        </div>
        <span className="flow-service-check">
          <Check size={17} />
        </span>
      </div>
      <div className="flow-split" aria-hidden="true">
        <span />
        <span />
      </div>
      <div className="flow-outputs">
        <div className="flow-output">
          <div>
            <Database size={20} />
            <strong>1С</strong>
          </div>
          <span>Учёт и процессы</span>
        </div>
        <div className="flow-output flow-output--radar">
          <div>
            <ScanSearch size={20} />
            <strong>Radar</strong>
          </div>
          <span>Сигналы и риски</span>
        </div>
      </div>
      <div className="flow-alert">
        <AlertTriangle size={14} aria-hidden="true" />
        <span>Маржа заказа ниже 8%</span>
      </div>
      <div className="flow-caption">
        <span>
          <ArrowRight size={14} /> Без ручного переноса
        </span>
        <span>
          <ArrowDown size={14} /> Решение вовремя
        </span>
      </div>
    </div>
  )
}

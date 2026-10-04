import { useState } from 'react'
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  Check,
  ChevronDown,
  CircleAlert,
  Package,
  TrendingDown,
  Users,
} from 'lucide-react'
import { calculateOrder, formatPercent, formatRubles, orderExample } from '../lib/radar'

type Signal = 'order' | 'stock' | 'client'

const signals: {
  id: Signal
  icon: typeof CircleAlert
  eyebrow: string
  title: string
  summary: string
}[] = [
  {
    id: 'order',
    icon: CircleAlert,
    eyebrow: 'МАРЖИНАЛЬНОСТЬ',
    title: 'Заказ №731',
    summary: 'Скидка снижает прибыль',
  },
  {
    id: 'stock',
    icon: Package,
    eyebrow: 'ОСТАТКИ',
    title: 'Товар AX-42',
    summary: 'Возможен дефицит через 11 дней',
  },
  {
    id: 'client',
    icon: Users,
    eyebrow: 'КЛИЕНТЫ',
    title: 'Клиент «Вектор»',
    summary: 'Оборот растёт, прибыль падает',
  },
]

function Metric({
  label,
  value,
  subtle = false,
}: {
  label: string
  value: string
  subtle?: boolean
}) {
  return (
    <div className="radar-metric">
      <span>{label}</span>
      <strong className={subtle ? 'metric-subtle' : ''}>{value}</strong>
    </div>
  )
}

function OrderDetails() {
  const [discount, setDiscount] = useState(12)
  const current = calculateOrder(discount)
  const baseline = calculateOrder(orderExample.baselineDiscount)

  return (
    <div className="radar-detail-content">
      <div className="detail-heading">
        <span className="detail-type">
          <CircleAlert size={16} /> РИСК ПО ЗАКАЗУ
        </span>
        <span className="detail-id">ЗАКАЗ {orderExample.number}</span>
      </div>
      <h3>Скидка изменила экономику заказа</h3>
      <p className="detail-intro">Измените скидку и посмотрите, сколько останется от прибыли.</p>
      <div className="margin-comparison">
        <div>
          <span>При скидке 5%</span>
          <strong>{formatPercent(baseline.margin)}</strong>
        </div>
        <ArrowRight size={20} aria-hidden="true" />
        <div className={current.atRisk ? 'margin-risk' : 'margin-safe'}>
          <span>При скидке {discount}%</span>
          <strong aria-live="polite">{formatPercent(current.margin)}</strong>
        </div>
      </div>
      <div className="discount-control">
        <div>
          <label htmlFor="discount">Скидка клиенту</label>
          <strong>{discount}%</strong>
        </div>
        <input
          id="discount"
          type="range"
          min="0"
          max="15"
          step="1"
          value={discount}
          onChange={(event) => setDiscount(Number(event.target.value))}
          aria-valuetext={`${discount} процентов`}
        />
        <div className="range-labels">
          <span>0%</span>
          <span>15%</span>
        </div>
      </div>
      <div className="radar-metrics">
        <Metric label="Выручка" value={formatRubles(current.revenue)} />
        <Metric label="Себестоимость" value={formatRubles(orderExample.purchaseCost)} />
        <Metric label="Доп. расходы" value={formatRubles(orderExample.extraCost)} />
        <Metric
          label="Ожидаемая прибыль"
          value={formatRubles(current.profit)}
          subtle={current.atRisk}
        />
      </div>
      <div className={`radar-recommendation${current.atRisk ? '' : ' radar-recommendation--safe'}`}>
        <span className="recommendation-icon">
          {current.atRisk ? <CircleAlert size={18} /> : <Check size={18} />}
        </span>
        <div>
          <strong>{current.atRisk ? 'Маржа ниже целевых 10%' : 'Маржа выше целевых 10%'}</strong>
          <p>
            {current.atRisk
              ? `Минимальная цена для маржи 10% — ${formatRubles(current.minimumPrice)}. Проверьте скидку до согласования.`
              : 'Цена сохраняет целевую маржинальность. Можно продолжать оформление заказа.'}
          </p>
        </div>
      </div>
    </div>
  )
}

function StockDetails() {
  return (
    <div className="radar-detail-content">
      <div className="detail-heading">
        <span className="detail-type">
          <Package size={16} /> ПРОГНОЗ ОСТАТКОВ
        </span>
        <span className="detail-id">SKU AX-42</span>
      </div>
      <h3>Через 11 дней возможен дефицит</h3>
      <p className="detail-intro">
        Текущий темп продаж выше обычного. Новая поставка придёт позже прогнозной даты окончания
        остатка.
      </p>
      <div className="stock-chart" aria-label="Остаток снижается до нуля к одиннадцатому дню">
        <div className="stock-chart-grid" />
        <svg
          viewBox="0 0 440 130"
          role="img"
          aria-label="Прогноз остатка снижается со 180 до 0 единиц"
        >
          <path
            d="M0 14 C85 21 135 43 200 55 S325 88 440 123"
            fill="none"
            stroke="#3157e2"
            strokeWidth="3"
          />
          <path
            d="M0 14 C85 21 135 43 200 55 S325 88 440 123 L440 130 L0 130 Z"
            fill="url(#stockFade)"
          />
          <defs>
            <linearGradient id="stockFade" x1="0" x2="0" y1="0" y2="1">
              <stop stopColor="#3157e2" stopOpacity=".17" />
              <stop offset="1" stopColor="#3157e2" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="radar-metrics">
        <Metric label="Сейчас в наличии" value="180 шт." />
        <Metric label="Продажи за неделю" value="124 шт." />
        <Metric label="Следующая поставка" value="через 16 дней" />
      </div>
      <div className="radar-recommendation">
        <span className="recommendation-icon">
          <CircleAlert size={18} />
        </span>
        <div>
          <strong>Окно риска — около 5 дней</strong>
          <p>Проверьте возможность ускорить поставку или перераспределить остатки.</p>
        </div>
      </div>
    </div>
  )
}

function ClientDetails() {
  return (
    <div className="radar-detail-content">
      <div className="detail-heading">
        <span className="detail-type">
          <TrendingDown size={16} /> ЭКОНОМИКА КЛИЕНТА
        </span>
        <span className="detail-id">90 ДНЕЙ</span>
      </div>
      <h3>Оборот вырос, а прибыль снизилась.</h3>
      <p className="detail-intro">
        У «Вектора» стало больше заказов. Дополнительные скидки и логистика снизили среднюю маржу.
      </p>
      <div className="client-comparison">
        <div>
          <span>Оборот</span>
          <strong>+23%</strong>
          <small>к предыдущим 90 дням</small>
        </div>
        <div>
          <span>Прибыль</span>
          <strong className="negative">−8%</strong>
          <small>к предыдущим 90 дням</small>
        </div>
      </div>
      <div className="cause-list">
        <div>
          <span>
            <ArrowDownRight size={17} /> Скидки
          </span>
          <strong>−5,2 п.п.</strong>
        </div>
        <div>
          <span>
            <ArrowDownRight size={17} /> Логистика
          </span>
          <strong>−2,1 п.п.</strong>
        </div>
      </div>
      <div className="radar-recommendation">
        <span className="recommendation-icon">
          <CircleAlert size={18} />
        </span>
        <div>
          <strong>Проверьте условия следующих заказов</strong>
          <p>Причины падения маржи видны до нового согласования цены.</p>
        </div>
      </div>
    </div>
  )
}

export function RadarWidget() {
  const [selected, setSelected] = useState<Signal>('order')
  const [mobileListOpen, setMobileListOpen] = useState(false)
  const selectedSignal = signals.find((signal) => signal.id === selected)!

  return (
    <div className="radar-window" aria-label="Демонстрационный интерфейс Altacod Radar">
      <div className="radar-toolbar">
        <div className="radar-product">
          <span className="radar-product-mark">
            <Activity size={17} />
          </span>
          <strong>
            Altacod <span>Radar</span>
          </strong>
        </div>
        <div className="radar-toolbar-right">
          <span className="radar-demo-badge">ДЕМО СЦЕНАРИЙ</span>
          <span className="toolbar-dot" />
          <span>Сегодня, 09:41</span>
        </div>
      </div>
      <div className="radar-body">
        <aside
          className={`radar-sidebar${mobileListOpen ? ' radar-sidebar--open' : ''}`}
          aria-label="Список сигналов"
        >
          <div className="radar-side-head">
            <span>ОБЗОР</span>
            <strong>
              Всё нормально.
              <br />
              Кроме трёх вещей.
            </strong>
            <p>
              <span className="status-dot" /> Продажи без существенных отклонений
            </p>
          </div>
          <button
            className="mobile-signal-select"
            type="button"
            onClick={() => setMobileListOpen(!mobileListOpen)}
            aria-expanded={mobileListOpen}
            aria-controls="signal-list"
          >
            <span>{selectedSignal.title}</span>
            <ChevronDown size={18} />
          </button>
          <div id="signal-list" className="signal-list">
            <span className="signal-count">
              ТРЕБУЮТ ВНИМАНИЯ <b>03</b>
            </span>
            {signals.map((signal) => {
              const Icon = signal.icon
              return (
                <button
                  key={signal.id}
                  className={`signal-item${selected === signal.id ? ' signal-item--active' : ''}`}
                  type="button"
                  onClick={() => {
                    setSelected(signal.id)
                    setMobileListOpen(false)
                  }}
                  aria-pressed={selected === signal.id}
                >
                  <span className="signal-icon">
                    <Icon size={18} />
                  </span>
                  <span>
                    <small>{signal.eyebrow}</small>
                    <strong>{signal.title}</strong>
                    <em>{signal.summary}</em>
                  </span>
                  <ArrowRight className="signal-arrow" size={16} />
                </button>
              )
            })}
          </div>
          <div className="radar-side-foot">
            <span className="status-dot" /> Данные обновлены 2 минуты назад
          </div>
        </aside>
        <div className="radar-detail">
          {selected === 'order' ? (
            <OrderDetails />
          ) : selected === 'stock' ? (
            <StockDetails />
          ) : (
            <ClientDetails />
          )}
        </div>
      </div>
    </div>
  )
}

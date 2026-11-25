import Icon from './Icon'
import './FilterPanel.css'

const selectOptions = {
  finalidade: [['VENDA', 'À venda'], ['ALUGUEL', 'Para alugar'], ['VENDA_E_ALUGUEL', 'Venda ou aluguel']],
  natureza: [['CASA', 'Casa'], ['APARTAMENTO', 'Apartamento'], ['TERRENO', 'Terreno'], ['LOTE', 'Lote']],
  ordenacao: [['MAIS_RECENTES', 'Mais recentes'], ['MENOR_PRECO', 'Menor preço'], ['MAIOR_PRECO', 'Maior preço'], ['MENOR_AREA', 'Menor área'], ['MAIOR_AREA', 'Maior área']],
}

function currentValue(params, key) {
  return params.get(key) || ''
}

export default function FilterPanel({ params, characteristics = [], onApply, onClear, onClose }) {
  const selectedCharacteristics = params.getAll('caracteristicas')

  function submit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const next = new URLSearchParams()
    formData.forEach((value, key) => {
      if (String(value).trim()) next.append(key, String(value).trim())
    })
    next.set('ordenacao', String(formData.get('ordenacao') || 'MAIS_RECENTES'))
    next.set('pagina', '0')
    onApply(next)
  }

  return (
    <form className="filter-panel" onSubmit={submit}>
      <div className="filter-panel__heading">
        <div><span className="eyebrow">Refine sua busca</span><h2>Filtros</h2></div>
        {onClose && <button className="filter-panel__close" type="button" onClick={onClose} aria-label="Fechar filtros"><Icon name="close" /></button>}
      </div>
      <label className="field"><span>O que você procura?</span><input type="search" name="texto" defaultValue={currentValue(params, 'texto')} placeholder="Ex.: casa com quintal" /></label>
      <label className="field"><span>Finalidade</span><select name="finalidade" defaultValue={currentValue(params, 'finalidade')}><option value="">Todas</option>{selectOptions.finalidade.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <label className="field"><span>Tipo de imóvel</span><select name="natureza" defaultValue={currentValue(params, 'natureza')}><option value="">Todos</option>{selectOptions.natureza.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <label className="field"><span>Bairro</span><input name="bairro" defaultValue={currentValue(params, 'bairro')} placeholder="Qualquer bairro" /></label>
      <fieldset className="field-group">
        <legend>Faixa de preço</legend>
        <div className="field-pair"><label className="field"><span className="sr-only">Preço mínimo</span><input name="precoMinimo" type="number" min="0" step="0.01" defaultValue={currentValue(params, 'precoMinimo')} placeholder="Mínimo" /></label><label className="field"><span className="sr-only">Preço máximo</span><input name="precoMaximo" type="number" min="0" step="0.01" defaultValue={currentValue(params, 'precoMaximo')} placeholder="Máximo" /></label></div>
      </fieldset>
      <fieldset className="field-group">
        <legend>Características mínimas</legend>
        <div className="field-pair field-pair--three"><label className="field"><span>Quartos</span><input name="quartos" type="number" min="0" step="1" defaultValue={currentValue(params, 'quartos')} placeholder="0" /></label><label className="field"><span>Suítes</span><input name="suites" type="number" min="0" step="1" defaultValue={currentValue(params, 'suites')} placeholder="0" /></label><label className="field"><span>Vagas</span><input name="vagas" type="number" min="0" step="1" defaultValue={currentValue(params, 'vagas')} placeholder="0" /></label></div>
      </fieldset>
      <fieldset className="field-group">
        <legend>Área (m²)</legend>
        <div className="field-pair"><label className="field"><span className="sr-only">Área mínima</span><input name="areaMinima" type="number" min="0" step="1" defaultValue={currentValue(params, 'areaMinima')} placeholder="Mínima" /></label><label className="field"><span className="sr-only">Área máxima</span><input name="areaMaxima" type="number" min="0" step="1" defaultValue={currentValue(params, 'areaMaxima')} placeholder="Máxima" /></label></div>
      </fieldset>
      {characteristics.length > 0 && <fieldset className="field-group">
        <legend>Características do imóvel</legend>
        <div className="check-list">{characteristics.map((item) => <label key={item.id} className="check-option"><input type="checkbox" name="caracteristicas" value={item.id} defaultChecked={selectedCharacteristics.includes(String(item.id))} /><span>{item.nome}</span></label>)}</div>
      </fieldset>}
      <label className="field"><span>Ordenar por</span><select name="ordenacao" defaultValue={currentValue(params, 'ordenacao') || 'MAIS_RECENTES'}>{selectOptions.ordenacao.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <div className="filter-panel__actions"><button className="button button--primary" type="submit">Aplicar filtros <Icon name="arrow" size={17} /></button><button className="text-button" type="button" onClick={onClear}>Limpar filtros</button></div>
    </form>
  )
}

import React, { useEffect, useState } from 'react';
import { Select, Space } from 'antd';
import { impactos, getImpactoFromGiros } from './Utils';
import RecoleccionBasura from '../RecoleccionBasura/RecoleccionBasura';

export default function SelectGiros({ giros, impacto, setGirosIds, defaultValuesRecoleccionBasura, setServicioRecoleccionPrivado, setTarifaRecoleccionId, setNivelRecoleccionBasura }) {

  const getGirosOptions = () =>
    giros?.map(giro => ({
      label: giro?.nombre,
      value: giro?.id
    })) ?? [];

  useEffect(() => { girosSelectChange(defaultValuesRecoleccionBasura?.girosIds); console.log({ defaultValuesRecoleccionBasura }); }, []);

  const girosSelectChange = (values) => {
    const impacto = getImpactoFromGiros(giros?.filter(giro => values?.includes(giro?.id)))
    setGirosIds(values, impacto);
  }

  // Filter `option.label` match the user type `input`
  const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase()?.includes(input.toLowerCase());

  return (
    <>
      <Space direction={"vertical"} style={{ width: "100%" }}>
        <div>
          <strong>Impacto:</strong> {impactos[impacto]}
        </div>
        {giros !== null
          ? <Select
            mode="multiple"
            allowClear
            style={{
              width: '100%',
            }}
            placeholder="Seleccione el/los giros"
            defaultValue={defaultValuesRecoleccionBasura?.girosIds}
            onChange={girosSelectChange}
            options={getGirosOptions()}
            showSearch
            optionFilterProp="children"
            filterOption={filterOption}
          />
          : `Cargando giros...`
        }
      </Space>

      {
        defaultValuesRecoleccionBasura?.tarifaRecoleccionBasura &&
        <RecoleccionBasura
          setServicioRecoleccionPrivado={(ServicioRecoleccionPrivado) => { setServicioRecoleccionPrivado(ServicioRecoleccionPrivado); }}
          setTarifaRecoleccionId={(TarifaRecoleccionId) => { setTarifaRecoleccionId(TarifaRecoleccionId); }}
          setNivelRecoleccionBasura={(NivelRecoleccionBasura) => { setNivelRecoleccionBasura(NivelRecoleccionBasura); }}
          girosComerciales={giros?.filter(giro => defaultValuesRecoleccionBasura?.girosIds?.includes(giro?.id))}
          defaultValuesRecoleccionBasura={defaultValuesRecoleccionBasura}
        />
      }
    </>
  )
}

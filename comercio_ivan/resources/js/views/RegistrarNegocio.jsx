import React from 'react'
import NegocioModal from './components/NegocioModal'
import RolesRouter from './RolesRouter'

function RegistrarNegocio () {
  return (
    <div className="sare--container">
      <RolesRouter/>
      <div className="max-w-[1000px] bg-white mx-auto">
        <NegocioModal/>
      </div>
    </div>
  )
}

export default RegistrarNegocio

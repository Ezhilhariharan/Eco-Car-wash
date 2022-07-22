import React from 'react'

import ECommerceEmpty from '../../../../assets/ecommerce-empty.svg'
import { useTranslation } from 'react-i18next';
import './styles/EmptyLayout.scss'

export default function EmptyLayout({ openCreateProductModal }) {
	const { t, i18n } = useTranslation();
	return (
		<div className="e-commerce-empty-layout">
			<img src={ECommerceEmpty} alt="e-commerce-empty" />
			<button className="btn-navy mt-5" onClick={() => openCreateProductModal()}>
				{t('Create Product')}
			</button>
		</div>
	)
}

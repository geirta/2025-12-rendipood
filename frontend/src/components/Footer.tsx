
import { useTranslation } from 'react-i18next';

const Footer = () => {
  
  const { t, i18n } = useTranslation();

  return (
    <div>
        <footer className='footer'>
            <span>{t('footer.rights')}</span>
        </footer>
    </div>
  )
}

export default Footer
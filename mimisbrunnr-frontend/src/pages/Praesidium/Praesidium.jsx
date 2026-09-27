import SelectField from '../../components/Form/SelectField/SelectField';
import UserList from '../../components/UserList/UserList';
import AsyncData from '../../components/Common/AsyncData/AsyncData';
import useSWR from 'swr';
import { getAll } from '../../api';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';

const SPECIAL_OPTIONS = [
  { label: 'Superschachten', value: 'superschachten' },
  { label: 'Ereleden', value: 'ereleden' },
  { label: 'Lustrumcommités', value: 'lustrumcomitès' },
];

const Praesidium = () => {
  const navigate = useNavigate();
  const {
    data: years = { years: [] },
    error: yearsError,
    isLoading: yearsAreLoading,
  } = useSWR('praesidium/years', getAll);
  const [year, setYear] = useState(null);

  useEffect(() => {
    if (years?.years?.length > 0 && !year) {
      setYear(years.years[years.years.length - 1]);
    }
  }, [years, year]);

  const {
    data: praesidium = { praesidium: [] },
    error: praesidiumError,
    isLoading: praesidiumIsLoading,
  } = useSWR(year ? `praesidium/${year}` : null, getAll);

  const handleSelect = (option) => {
    const special = SPECIAL_OPTIONS.find((o) => o.label === option);
    if (special) {
      navigate(`/praesidium/${special.value}`);
    } else {
      setYear(option);
    }
  };

  const allOptions = [...SPECIAL_OPTIONS.map((o) => o.label), ...(years.years || [])];

  return (
    <div className="container-sm-tm">
      <Breadcrumbs children={[{ link: 'praesidium', isLast: true }]} />
      <h1>Praesidium</h1>
      <AsyncData loading={yearsAreLoading} error={yearsError}>
        <SelectField label={'Kies een jaar:'} options={allOptions} value={year} onChange={handleSelect} />
      </AsyncData>
      <AsyncData loading={praesidiumIsLoading} error={praesidiumError}>
        <UserList users={praesidium.praesidium} endpoint={'praesidium/members'} />
      </AsyncData>
    </div>
  );
};

export default Praesidium;

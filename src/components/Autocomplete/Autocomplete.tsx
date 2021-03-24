import React, {
  memo, RefObject, useCallback, useEffect, useMemo, useRef,
} from 'react';
import TextField from '@material-ui/core/TextField';
import { Autocomplete as MaterialAutocomplete } from '@material-ui/core';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import parse from 'autosuggest-highlight/parse';
import throttle from 'lodash.throttle';
import { GoogleApiWrapper } from 'google-maps-react';
import { ActiveInput } from '../../store/markerStore/reducer';
import { useMarkerDispatch } from '../../store/markerStore';
import googleServices from '../../services/googleServices';
import useOutsideClick from '../../hooks/useOutsideClick';

const useStyles = makeStyles((theme) => ({
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2),
  },
  autocomplete: {
    marginBottom: 16,
  },
}));

type MainTextMatchedSubstrings = {
  offset: number;
  length: number;
}
type StructuredFormatting = {
  main_text: string;
  secondary_text: string;
  main_text_matched_substrings: MainTextMatchedSubstrings[];
}
type PlaceType = {
  description: string;
  structured_formatting: StructuredFormatting;
  place_id: string;
}

type AutocompleteProps = {
  google: any,
  label: string,
  point: ActiveInput,
  markerPointAddress: string,
  activeInput: ActiveInput,
  mapRef: RefObject<HTMLInputElement>,
}

const Autocomplete = ({
  google, label, point, markerPointAddress, activeInput, mapRef,
}: AutocompleteProps): JSX.Element => {
  const classes = useStyles();
  const [value, setValue] = React.useState<PlaceType | string | null>(null);
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState<(PlaceType | string)[]>([]);
  const { setActiveInput, setMarkerLatLng } = useMarkerDispatch();
  const inputRef = useRef(null);

  useOutsideClick(inputRef, mapRef, () => {
    if (point === activeInput) {
      setActiveInput(null);
    }
  });

  const fetchAutocomplete = useMemo(
    () =>
      throttle(
        (request: { input: string }, callback: (results?: PlaceType[]) => void) => {
          (googleServices.autocomplete as any).getPlacePredictions(
            request,
            callback,
          );
        },
        300,
      ),
    [],
  );

  useEffect(() => {
    setValue(markerPointAddress);
  }, [markerPointAddress]);

  useEffect(() => {
    let active = true;

    if (!googleServices.autocomplete) {
      googleServices.autocomplete = new google.maps.places.AutocompleteService();
    }

    if (inputValue === '') {
      setOptions([]);

      return;
    }

    fetchAutocomplete({ input: inputValue }, (results?: PlaceType[]) => {
      if (active) {
        let newOptions = [] as PlaceType[];

        if (results) {
          newOptions = [
            ...newOptions,
            ...results.map(({ description, structured_formatting, place_id }) => ({
              description,
              structured_formatting,
              place_id,
            }))];
        }

        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [inputValue, fetchAutocomplete, google.maps.places.AutocompleteService]);

  const setGeocode = useCallback((selectedValue) => {
    if (!selectedValue) {
      setMarkerLatLng(point, null);

      return;
    }
    if (!googleServices.geocoder) {
      googleServices.geocoder = new google.maps.Geocoder();
    }
    googleServices.geocoder.geocode(
      { placeId: selectedValue.place_id }, (results: any, status: any) => {
        if (status === 'OK') {
          if (results[0]) {
            const { location } = results[0].geometry;

            setMarkerLatLng(point, {
              lat: location.lat(),
              lng: location.lng(),
            });
          } else {
            window.alert('No results found');
          }
        } else {
          window.alert(`Geocoder failed due to: ${status}`);
        }
      },
    );
  }, [google.maps.Geocoder, point, setMarkerLatLng]);

  return (
    <MaterialAutocomplete
      ref={inputRef}
      className={classes.autocomplete}
      getOptionLabel={(option) =>
        typeof option === 'string' ? option : option.description}
      getOptionSelected={(option: PlaceType, selectedValue) =>
        typeof selectedValue === 'string' ? true : option.description === selectedValue.description}
      filterOptions={(x) => x}
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={value as PlaceType | string | null}
      onChange={(event: any, newValue: PlaceType | null) => {
        setOptions(newValue ? [newValue, ...options] : options);
        setValue(newValue);
        setGeocode(newValue);
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          inputRef={(input) => input && activeInput === point && input.focus()}
          label={label}
          fullWidth
          onClick={() => setActiveInput(point)}
        />
      )}
      renderOption={(props, option: PlaceType) => {
        const matches = option.structured_formatting.main_text_matched_substrings;
        const parts = parse(
          option.structured_formatting.main_text,
          matches.map((match: any) => [match.offset, match.offset + match.length]),
        );

        return (
          <li {...props}>
            <Grid container alignItems="center">
              <Grid item>
                <LocationOnIcon className={classes.icon} />
              </Grid>
              <Grid item xs>
                {parts.map((part: any, index: number) => (
                  <span
                    key={`${index + part.text}`}
                    style={{
                      fontWeight: part.highlight ? 700 : 400,
                    }}
                  >
                    {part.text}
                  </span>
                ))}
                <Typography variant="body2" color="textSecondary">
                  {option.structured_formatting.secondary_text}
                </Typography>
              </Grid>
            </Grid>
          </li>
        );
      }}
    />
  );
};

export default memo(GoogleApiWrapper({
  apiKey: process.env.GOOGLE_MAP_API_KEY,
})(Autocomplete));

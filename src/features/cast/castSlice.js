import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { round } from 'lodash'
import { fetchActorInfo } from '../movies/movieAPI';

const initialState = {
   list: [],
   loading_cast: false,
   castSortSettings: {
      by: 'name',
      asc: true,
   },
   castFilterSettings: {
      by: 'gender',
      val: 'all',
   },
};

export const fetchCastMemberInfo = createAsyncThunk(
   'cast/fetchActorInformation',
   async (url) => {
      return await fetchActorInfo(url);
   }
 );

export const castSlice = createSlice({
   name: 'cast',
   initialState,
   reducers: {
      sortCast: (state, action) => {
         if (state.castSortSettings.by === action.payload) {
           state.castSortSettings.asc = !state.castSortSettings.asc;
         } else {
           state.castSortSettings = {
              by: action.payload,
              asc: true,
           };
         }
      },
      filterCast: (state, action) => {
        state.castFilterSettings = action.payload;
      },
      resetCastList: (state) => {
         state.list = [];
      },
   },

   extraReducers: (builder) => {
      builder 
        .addCase(fetchCastMemberInfo.pending, (state) => {
           state.loading_cast = true;
        })
        .addCase(fetchCastMemberInfo.fulfilled, (state, action) => {
           state.loading_cast = false;
           state.list.push(action.payload);
        });
   },
});

const getFilteredCast = (state) => {
   console.log("here is the state", state);
   const filter = state.cast.castFilterSettings;
   return state.cast.list.filter(actor => {
      if (filter.val === 'all') return true;
      else if (filter.by === 'gender') return actor.gender === filter.val;
      else return false;
   });
 }

 export const sortBy = (list, prop, asc, type) => {
   return list.sort((a1, a2) => {
      if (type === 'number') {
         const num1 = isNaN(a1[prop]) ? 0 : Number(a1[prop]);
         const num2 = isNaN(a2[prop]) ? 0 : Number(a2[prop]);
         return asc ? (num1 - num2) : (num2 - num1);
      }

      if (asc) {
         if (a1[prop] > a2[prop]) return 1;
         else if (a1[prop] < a2[prop]) return -1;
         else return 0;
      } else {
         if (a1[prop] < a2[prop]) return 1;
         else if (a1[prop] > a2[prop]) return -1;
         else return 0;
      }
   });
};

 export const selectCast = (state) => {
   
   const sortSettings = state.cast.castSortSettings;

   return sortBy(
      getFilteredCast(state), 
      sortSettings.by,
      sortSettings.asc,
      sortSettings.by === 'height' ? 'number' : 'string'
   );
};

export const selectCastSortSettings = (state) => state.cast.castSortSettings;

export const castStatus = (state) => state.cast.loading_cast;

export const castCountSelector = (state) => getFilteredCast(state).length;

export const heightTotalSelector = (state) => {
   if (!state.cast.list.length) return [0, 0, 0];
   const totalInCMs = getFilteredCast(state).reduce((totalHeight, { height }) => {
      return isNaN(height) ? 
         totalHeight : (totalHeight + Number(height));
   }, 0);

   const centimeterInInches = 2.54;
   const centimeterInFeet = 30.48;
   const totalInInches = totalInCMs / centimeterInInches;
   const totalInFt = totalInCMs / centimeterInFeet;
   return [round(totalInCMs, 2), round(totalInInches, 2), round(totalInFt, 2)];
}

export const { sortCast, filterCast, resetCastList } = castSlice.actions;
export default castSlice;
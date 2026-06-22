export interface Species {
  id: string;
  name_en: string;
  name_af: string;
  shoulder_height_cm: number;
  vital_zone_height_cm: number;
  vital_zone_radius_cm: number;
  body_length_cm: number;
  weight_kg: number;
  horn_measure: "spiral"|"straight"|"curved"|"none";
  image_path: string;
  vital_x: number;
  vital_y: number;
  ground_y: number;
  shoulder_y: number;
  spine_y: number;
  vital_radius_pct: number;
  vital_zone_special?: boolean;
  notes?: string;
}

export const SPECIES: Species[] = [
  {
    id:"steenbok", name_en:"Steenbok", name_af:"Steenbok",
    shoulder_height_cm:51, vital_zone_height_cm:19, vital_zone_radius_cm:6,
    body_length_cm:95, weight_kg:11, horn_measure:"straight",
    image_path:"/animals/steenbok.png",
    vital_x:0.582, vital_y:0.652, ground_y:0.943, shoulder_y:0.556, spine_y:0.516, vital_radius_pct:0.06,
  },
  {
    id:"duiker", name_en:"Common Duiker", name_af:"Duiker",
    shoulder_height_cm:54, vital_zone_height_cm:20, vital_zone_radius_cm:7,
    body_length_cm:100, weight_kg:18, horn_measure:"straight",
    image_path:"/animals/duiker.png",
    vital_x:0.574, vital_y:0.686, ground_y:0.912, shoulder_y:0.602, spine_y:0.562, vital_radius_pct:0.06,
  },
  {
    id:"warthog", name_en:"Warthog", name_af:"Vlakvark",
    shoulder_height_cm:69, vital_zone_height_cm:26, vital_zone_radius_cm:10,
    body_length_cm:120, weight_kg:80, horn_measure:"curved",
    image_path:"/animals/warthog.png",
    vital_x:0.562, vital_y:0.699, ground_y:0.902, shoulder_y:0.596, spine_y:0.556, vital_radius_pct:0.07,
  },
  {
    id:"mountain-reed", name_en:"Mountain Reedbuck", name_af:"Rooiribbok",
    shoulder_height_cm:75, vital_zone_height_cm:28, vital_zone_radius_cm:10,
    body_length_cm:130, weight_kg:30, horn_measure:"curved",
    image_path:"/animals/mountainreedbuck.png",
    vital_x:0.540, vital_y:0.658, ground_y:0.969, shoulder_y:0.551, spine_y:0.511, vital_radius_pct:0.07,
  },
  {
    id:"springbok", name_en:"Springbok", name_af:"Springbok",
    shoulder_height_cm:77, vital_zone_height_cm:29, vital_zone_radius_cm:10,
    body_length_cm:130, weight_kg:37, horn_measure:"curved",
    image_path:"/animals/springbok.png",
    vital_x:0.587, vital_y:0.628, ground_y:0.933, shoulder_y:0.543, spine_y:0.503, vital_radius_pct:0.07,
  },
  {
    id:"bushbuck", name_en:"Bushbuck", name_af:"Bosbok",
    shoulder_height_cm:80, vital_zone_height_cm:30, vital_zone_radius_cm:11,
    body_length_cm:140, weight_kg:45, horn_measure:"spiral",
    image_path:"/animals/bushbuck.png",
    vital_x:0.552, vital_y:0.726, ground_y:0.961, shoulder_y:0.613, spine_y:0.573, vital_radius_pct:0.07,
  },
  {
    id:"reedbuck", name_en:"Common Reedbuck", name_af:"Rietbok",
    shoulder_height_cm:88, vital_zone_height_cm:33, vital_zone_radius_cm:11,
    body_length_cm:150, weight_kg:65, horn_measure:"curved",
    image_path:"/animals/reedbuck.png",
    vital_x:0.38, vital_y:0.61, ground_y:0.92, shoulder_y:0.35, spine_y:0.29, vital_radius_pct:0.07,
    notes:"No photo yet — using fallback"
  },
  {
    id:"impala", name_en:"Impala", name_af:"Rooibok",
    shoulder_height_cm:90, vital_zone_height_cm:34, vital_zone_radius_cm:12,
    body_length_cm:150, weight_kg:55, horn_measure:"curved",
    image_path:"/animals/impala.png",
    vital_x:0.532, vital_y:0.688, ground_y:0.960, shoulder_y:0.590, spine_y:0.550, vital_radius_pct:0.08,
  },
  {
    id:"fallow-deer", name_en:"Fallow Deer", name_af:"Damhert",
    shoulder_height_cm:90, vital_zone_height_cm:34, vital_zone_radius_cm:11,
    body_length_cm:145, weight_kg:60, horn_measure:"straight",
    image_path:"/animals/fallowdeer.png",
    vital_x:0.531, vital_y:0.675, ground_y:0.922, shoulder_y:0.577, spine_y:0.537, vital_radius_pct:0.08,
  },
  {
    id:"blesbok", name_en:"Blesbok", name_af:"Blesbok",
    shoulder_height_cm:94, vital_zone_height_cm:35, vital_zone_radius_cm:12,
    body_length_cm:165, weight_kg:70, horn_measure:"curved",
    image_path:"/animals/blesbuck.png",
    vital_x:0.591, vital_y:0.697, ground_y:0.963, shoulder_y:0.579, spine_y:0.539, vital_radius_pct:0.08,
  },
  {
    id:"nyala", name_en:"Nyala", name_af:"Njala",
    shoulder_height_cm:100, vital_zone_height_cm:38, vital_zone_radius_cm:14,
    body_length_cm:165, weight_kg:107, horn_measure:"spiral",
    image_path:"/animals/nyala.png",
    vital_x:0.553, vital_y:0.684, ground_y:0.953, shoulder_y:0.569, spine_y:0.529, vital_radius_pct:0.08,
  },
  {
    id:"black-wilde", name_en:"Black Wildebeest", name_af:"Swart Wildebees",
    shoulder_height_cm:114, vital_zone_height_cm:43, vital_zone_radius_cm:16,
    body_length_cm:180, weight_kg:155, horn_measure:"curved",
    image_path:"/animals/bluewildebeest.png",
    vital_x:0.565, vital_y:0.711, ground_y:0.971, shoulder_y:0.589, spine_y:0.549, vital_radius_pct:0.09,
    notes:"Using blue wildebeest photo as fallback until black wildebeest photo added"
  },
  {
    id:"gemsbok", name_en:"Gemsbok / Oryx", name_af:"Gemsbok",
    shoulder_height_cm:120, vital_zone_height_cm:44, vital_zone_radius_cm:18,
    body_length_cm:200, weight_kg:200, horn_measure:"straight",
    image_path:"/animals/gemsbok.png",
    vital_x:0.573, vital_y:0.701, ground_y:0.936, shoulder_y:0.574, spine_y:0.534, vital_radius_pct:0.09,
  },
  {
    id:"tsessebe", name_en:"Tsessebe", name_af:"Basterhartbees",
    shoulder_height_cm:120, vital_zone_height_cm:45, vital_zone_radius_cm:16,
    body_length_cm:190, weight_kg:140, horn_measure:"curved",
    image_path:"/animals/tsessebe.png",
    vital_x:0.564, vital_y:0.666, ground_y:0.925, shoulder_y:0.552, spine_y:0.512, vital_radius_pct:0.09,
  },
  {
    id:"red-hartebeest", name_en:"Red Hartebeest", name_af:"Rooihartbees",
    shoulder_height_cm:123, vital_zone_height_cm:46, vital_zone_radius_cm:17,
    body_length_cm:200, weight_kg:150, horn_measure:"curved",
    image_path:"/animals/tsessebe.png",
    vital_x:0.529, vital_y:0.621, ground_y:0.948, shoulder_y:0.497, spine_y:0.457, vital_radius_pct:0.09,
    notes:"Using tsessebe photo as fallback until red hartebeest photo added"
  },
  {
    id:"waterbuck", name_en:"Waterbuck", name_af:"Waterbok",
    shoulder_height_cm:130, vital_zone_height_cm:49, vital_zone_radius_cm:18,
    body_length_cm:210, weight_kg:220, horn_measure:"curved",
    image_path:"/animals/waterbuck.png",
    vital_x:0.530, vital_y:0.685, ground_y:0.930, shoulder_y:0.576, spine_y:0.536, vital_radius_pct:0.09,
  },
  {
    id:"zebra", name_en:"Plains Zebra", name_af:"Bontsebra",
    shoulder_height_cm:133, vital_zone_height_cm:50, vital_zone_radius_cm:20,
    body_length_cm:220, weight_kg:320, horn_measure:"none",
    image_path:"/animals/zebra.png",
    vital_x:0.587, vital_y:0.669, ground_y:0.952, shoulder_y:0.556, spine_y:0.516, vital_radius_pct:0.10,
  },
  {
    id:"sable", name_en:"Sable Antelope", name_af:"Swartwitpens",
    shoulder_height_cm:133, vital_zone_height_cm:50, vital_zone_radius_cm:18,
    body_length_cm:210, weight_kg:220, horn_measure:"curved",
    image_path:"/animals/sable.png",
    vital_x:0.590, vital_y:0.652, ground_y:0.932, shoulder_y:0.518, spine_y:0.478, vital_radius_pct:0.09,
  },
  {
    id:"blue-wilde", name_en:"Blue Wildebeest", name_af:"Blou Wildebees",
    shoulder_height_cm:137, vital_zone_height_cm:52, vital_zone_radius_cm:20,
    body_length_cm:220, weight_kg:250, horn_measure:"curved",
    image_path:"/animals/bluewildebeest.png",
    vital_x:0.608, vital_y:0.657, ground_y:0.956, shoulder_y:0.502, spine_y:0.462, vital_radius_pct:0.10,
  },
  {
    id:"roan", name_en:"Roan Antelope", name_af:"Bastergemsbok",
    shoulder_height_cm:145, vital_zone_height_cm:54, vital_zone_radius_cm:20,
    body_length_cm:240, weight_kg:270, horn_measure:"curved",
    image_path:"/animals/roan.png",
    vital_x:0.610, vital_y:0.648, ground_y:0.942, shoulder_y:0.514, spine_y:0.474, vital_radius_pct:0.10,
  },
  {
    id:"kudu", name_en:"Greater Kudu", name_af:"Koedoe",
    shoulder_height_cm:150, vital_zone_height_cm:55, vital_zone_radius_cm:22,
    body_length_cm:250, weight_kg:220, horn_measure:"spiral",
    image_path:"/animals/kudu.png",
    vital_x:0.573, vital_y:0.535, ground_y:0.925, shoulder_y:0.363, spine_y:0.323, vital_radius_pct:0.10,
  },
  {
    id:"buffalo", name_en:"Cape Buffalo", name_af:"Buffel",
    shoulder_height_cm:150, vital_zone_height_cm:55, vital_zone_radius_cm:25,
    body_length_cm:280, weight_kg:750, horn_measure:"curved",
    image_path:"/animals/buffalo.png",
    vital_x:0.594, vital_y:0.711, ground_y:0.939, shoulder_y:0.559, spine_y:0.519, vital_radius_pct:0.11,
  },
  {
    id:"eland", name_en:"Eland", name_af:"Eland",
    shoulder_height_cm:168, vital_zone_height_cm:62, vital_zone_radius_cm:28,
    body_length_cm:300, weight_kg:700, horn_measure:"spiral",
    image_path:"/animals/eland.png",
    vital_x:0.584, vital_y:0.701, ground_y:0.957, shoulder_y:0.559, spine_y:0.519, vital_radius_pct:0.11,
  },
  {
    id:"ostrich", name_en:"Ostrich", name_af:"Volstruis",
    shoulder_height_cm:125, vital_zone_height_cm:72, vital_zone_radius_cm:15,
    body_length_cm:200, weight_kg:130, horn_measure:"none",
    image_path:"/animals/ostrich.png",
    vital_x:0.595, vital_y:0.595, ground_y:0.950, shoulder_y:0.459, spine_y:0.419, vital_radius_pct:0.08,
    vital_zone_special:true,
    notes:"Body height 125cm. Heart/lung at 72cm from ground. Vital zone mid-body forward behind wing joint."
  },
  {
    id:"giraffe", name_en:"Giraffe", name_af:"Kameelperd",
    shoulder_height_cm:290, vital_zone_height_cm:190, vital_zone_radius_cm:35,
    body_length_cm:400, weight_kg:1200, horn_measure:"none",
    image_path:"/animals/giraffe.png",
    vital_x:0.517, vital_y:0.561, ground_y:0.970, shoulder_y:0.397, spine_y:0.357, vital_radius_pct:0.09,
    vital_zone_special:true,
    notes:"Shoulder 290cm. Heart/lung at 190cm from ground behind front leg."
  },
  {
    id:"baboon", name_en:"Baboon", name_af:"Bobbejaan",
    shoulder_height_cm:65, vital_zone_height_cm:25, vital_zone_radius_cm:8,
    body_length_cm:110, weight_kg:30, horn_measure:"none",
    image_path:"/animals/baboon.png",
    vital_x:0.761, vital_y:0.714, ground_y:0.949, shoulder_y:0.585, spine_y:0.545, vital_radius_pct:0.07,
    vital_zone_special:true, notes:"Heart/lung behind shoulder, low in chest",
  },
  {
    id:"jackal", name_en:"Black-backed Jackal", name_af:"Rooijakkals",
    shoulder_height_cm:38, vital_zone_height_cm:14, vital_zone_radius_cm:5,
    body_length_cm:75, weight_kg:8, horn_measure:"none",
    image_path:"/animals/jackal.png",
    vital_x:0.603, vital_y:0.782, ground_y:0.962, shoulder_y:0.667, spine_y:0.627, vital_radius_pct:0.06,
    vital_zone_special:true, notes:"Small target — heart/lung directly behind shoulder",
  },];

export const getSpeciesById = (id: string) => SPECIES.find(s => s.id === id);
export const getSpeciesByHornType = (type: Species["horn_measure"]) => SPECIES.filter(s => s.horn_measure === type);
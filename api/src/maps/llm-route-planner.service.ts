import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { BaseStop, LlmResponse, StopCandidate } from './dto/maps.dto';

// Servicio para planificar rutas de autobús utilizando inteligencia artificial (LLM)
// Selecciona paradas óptimas entre un origen y destino en Venezuela
@Injectable()
export class LlmRoutePlannerService {
  private readonly openai: OpenAI;
  private readonly MAX_LLM_STOPS = 5; // Número máximo de paradas a seleccionar
  private readonly MIN_LLM_STOPS = 2; // Número mínimo de paradas a seleccionar
  private readonly COUNTRY_BIAS = 'VE'; // Código de país para Venezuela, usado en el prompt

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('Server Configuration Error: OPENAI_API_KEY missing');
    }
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  /**
   * Utiliza IA para seleccionar paradas de autobús relevantes de una lista de candidatos.
   * @param origin - El lugar de origen resuelto.
   * @param destination - El lugar de destino resuelto.
   * @param candidates - Array de posibles paradas candidatas.
   * @returns Promesa que resuelve a un array de objetos BaseStop elegidos por la IA.
   */
  async selectStopsViaLlm(
    origin: BaseStop,
    destination: BaseStop,
    candidates: StopCandidate[],
  ): Promise<BaseStop[]> {
    if (candidates.length === 0) {
      return [];
    }

    const candidatesForLlm: StopCandidate[] = candidates.map((c) => ({
      name: c.name,
      lat: c.lat,
      lng: c.lng,
      types: c.types,
      placeId: c.placeId,
      vicinity: c.vicinity,
    }));

    const systemPrompt =
      `You are an expert urban transit planner creating a bus route in Venezuela (${this.COUNTRY_BIAS}). ` +
      `Your task is to select between ${this.MIN_LLM_STOPS} and ${this.MAX_LLM_STOPS} relevant and geographically sensible bus stops ` +
      `from the provided candidate list to connect the origin and destination. ` +
      `Prioritize locations that are logical stopping points for a public bus: major transit points (existing bus stops, metro stations), ` +
      `significant landmarks, public parks/plazas, shopping centers/markets, and key intersections along the likely path. ` +
      `Ensure the selected stops make sense sequentially between the origin and destination. ` +
      `Respond ONLY with a valid JSON object containing a single key "stops". ` +
      `The value of "stops" must be an array of the selected stop objects. ` +
      `Each stop object in the array must include these exact keys: "name" (string), "lat" (number), "lng" (number), and "placeId" (string). ` +
      `If no candidates are suitable, return an empty "stops" array.`;

    const userPromptPayload = {
      origin: { name: origin.name, lat: origin.lat, lng: origin.lng },
      destination: {
        name: destination.name,
        lat: destination.lat,
        lng: destination.lng,
      },
      candidates: candidatesForLlm,
    };

    try {
      const gptResponse = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: JSON.stringify(userPromptPayload) },
        ],
        response_format: { type: 'json_object' },
      });

      const rawContent = gptResponse.choices[0]?.message?.content;

      if (!rawContent) {
        throw new Error('LLM returned empty content.');
      }

      const parsedJson: Partial<LlmResponse> = JSON.parse(rawContent);

      if (!parsedJson || !Array.isArray(parsedJson.stops)) {
        throw new Error('LLM response did not contain a valid "stops" array.');
      }

      const llmPicks = parsedJson.stops.filter(
        (stop) =>
          stop &&
          typeof stop.name === 'string' &&
          typeof stop.lat === 'number' &&
          typeof stop.lng === 'number' &&
          typeof stop.placeId === 'string',
      ) as BaseStop[];

      return llmPicks;
    } catch (error) {
      return [];
    }
  }
}

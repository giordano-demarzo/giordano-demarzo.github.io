import chess.pgn
import json

def extract_comment_and_variations(node, board):
    """
    Extract the comment associated with a move, including only the first move of each variation,
    and include move numbers in variations.
    """
    comment = node.comment.replace('\n', ' ').strip()

    # Collect the first move of each variation (excluding the mainline)
    variations = []
    variations_text = ''
    for variation in node.variations:
        if variation != node.variation(0):
            # Get the move number and SAN for the variation's first move
            move_number = board.fullmove_number
            if board.turn == chess.WHITE:
                # We just played Black's move, so variation starts with White's move
                prefix = f"{move_number}."
            else:
                # We just played White's move, so variation starts with Black's move
                prefix = f"{move_number}..."
            first_move_san = variation.san()
            variation_text = f"{prefix} {first_move_san}"
            variations.append(variation_text)

    # Append the first moves of variations to the comment if they exist
    if variations:
        variations_text = ', '.join(variations)

    return comment.strip(), variations_text

def create_training_dataset(pgn_file_path):
    dataset = []
    i = 0 
    with open(pgn_file_path, 'r', encoding='utf-8') as pgn_file:
        while i<100:
            i = i + 1
            print(i)
            game = chess.pgn.read_game(pgn_file)
            if game is None:
                break  # No more games

            node = game
            board = game.board()
            moves = []
            move_count = 0
            variations = ''
            while not node.is_end():
                if node.variations:
                    next_node = node.variation(0)
                    move = next_node.move

                    # Get move number and side before pushing the move
                    move_number = board.fullmove_number
                    if board.turn == chess.WHITE:
                        move_label = f"{move_number}."
                    else:
                        move_label = f""

                    # Get SAN notation of the move
                    san_move = board.san(move)

                    # Update the moves list
                    moves.append(f"{move_label} {san_move}")

                    # Push the move to update the board state
                    board.push(move)
                    
                    variations_old = variations[:]
                    # Extract comments and variations from the next node (after the move)
                    comment_with_variations, variations = extract_comment_and_variations(next_node, board)

                    if comment_with_variations:
                        # Input is the sequence of mainline moves up to the current move
                        input_moves = ' '.join(moves)
                        # Output is the comment and variations attached to the current move
                        output_comment = comment_with_variations + ' ' + variations_old

                        # Add to the dataset in JSON-compatible format
                        dataset.append({
                            'input': input_moves,
                            'output': output_comment
                        })

                    node = next_node  # Advance to the next node
                    move_count += 1

                    # Limit to 10 full moves (20 ply)
                    if move_count >= 20:
                        break
                else:
                    break  # No further moves

    return dataset

def save_dataset(dataset, output_file_path):
    with open(output_file_path, 'w', encoding='utf-8') as f:
        json.dump(dataset, f, indent=4, ensure_ascii=False)

# Usage
pgn_file_path = 'chesspublishinga.pgn'
output_file_path = 'training_dataset.json'

dataset = create_training_dataset(pgn_file_path)
save_dataset(dataset, output_file_path)

print(f"Dataset has been saved to {output_file_path}")
